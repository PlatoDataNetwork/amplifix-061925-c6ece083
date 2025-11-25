import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

interface ProgressUpdate {
  phase: string;
  currentArticle: number;
  totalArticles: number;
  updated: number;
  skipped: number;
  errors: number;
  percentage: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header received:", authHeader ? "Yes" : "No");
    
    if (!authHeader) {
      console.log("❌ No authorization header");
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use a dedicated auth client and pass the token explicitly
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } },
      },
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    console.log("User check:", { hasUser: !!user, error: userError?.message });

    if (userError || !user) {
      console.log("❌ User authentication failed");
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: userError?.message }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("✅ User authenticated:", user.email);

    const { data: isAdmin } = await supabaseAuth.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    console.log("Admin check:", { isAdmin, userId: user.id });

    if (!isAdmin) {
      console.log("❌ User is not admin");
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Starting backfill for admin user:", user.email);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const channelName = `aviation-backfill-${crypto.randomUUID()}`;

    async function runBackfill() {
      let updated = 0;
      let skipped = 0;
      let errors = 0;

      console.log("Starting Aviation URL backfill");

      const { data: articles, error: fetchError } = await supabaseAdmin
        .from("articles")
        .select("id, post_id, external_url")
        .eq("vertical_slug", "aviation")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching articles:", fetchError);
        throw fetchError;
      }

      if (!articles || articles.length === 0) {
        console.log("No Aviation articles found");
        return { updated: 0, skipped: 0, errors: 0 };
      }

      console.log(`Found ${articles.length} Aviation articles to process`);

      const totalArticles = articles.length;

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];

        try {
          await supabaseAdmin.channel(channelName).send({
            type: "broadcast",
            event: "progress",
            payload: {
              phase: "processing",
              currentArticle: i + 1,
              totalArticles,
              updated,
              skipped,
              errors,
              percentage: Math.round(((i + 1) / totalArticles) * 100),
            } satisfies ProgressUpdate,
          });

          if (article.external_url && article.external_url.trim() !== "") {
            console.log(`Article ${article.id} already has external_url, skipping`);
            skipped++;
            continue;
          }

          if (!article.post_id) {
            console.log(`Article ${article.id} has no post_id, skipping`);
            skipped++;
            continue;
          }

          const aviationUrl = `https://platodata.ai/aviation/json/?p=${article.post_id}`;
          console.log(`Fetching Aviation article from: ${aviationUrl}`);

          const response = await fetch(aviationUrl);

          if (!response.ok) {
            console.error(`Failed to fetch article ${article.post_id}: ${response.status}`);
            errors++;
            continue;
          }

          const data = await response.json();

          if (!Array.isArray(data) || data.length === 0) {
            console.error(`No data returned for article ${article.post_id}`);
            errors++;
            continue;
          }

          const articleData = data[0];
          const sourceUrl = articleData?.link;

          if (!sourceUrl || sourceUrl.trim() === "") {
            console.error(`No source URL found for article ${article.post_id}`);
            errors++;
            continue;
          }

          console.log(`Updating article ${article.id} with source URL: ${sourceUrl}`);

          const { error: updateError } = await supabaseAdmin
            .from("articles")
            .update({ external_url: sourceUrl })
            .eq("id", article.id);

          if (updateError) {
            console.error(`Error updating article ${article.id}:`, updateError);
            errors++;
          } else {
            updated++;
            console.log(`Successfully updated article ${article.id}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error processing article ${article.id}:`, error);
          errors++;
        }
      }

      await supabaseAdmin.channel(channelName).send({
        type: "broadcast",
        event: "complete",
        payload: {
          phase: "complete",
          currentArticle: totalArticles,
          totalArticles,
          updated,
          skipped,
          errors,
          percentage: 100,
        } satisfies ProgressUpdate,
      });

      console.log("Aviation URL backfill complete", { updated, skipped, errors });

      return { updated, skipped, errors };
    }

    if (typeof req.waitUntil === "function") {
      req.waitUntil(runBackfill());
    } else {
      runBackfill();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Aviation URL backfill started",
        channelName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in backfill-aviation-urls:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

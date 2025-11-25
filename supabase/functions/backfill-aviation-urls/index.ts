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

    const token = authHeader.replace("Bearer ", "");
    let userId: string | null = null;
    let userEmail: string | null = null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);
      userId = payload.sub || null;
      userEmail = payload.email || payload.user_metadata?.email || null;
    } catch (e) {
      console.error("Error decoding JWT:", e);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: "Invalid JWT" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("User check via JWT:", { hasUserId: !!userId, userEmail });

    if (!userId) {
      console.log("❌ User authentication failed - no user id in token");
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: "Missing user id in token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    console.log("Admin check:", { isAdmin, userId, roleError: roleError?.message });

    if (roleError || !isAdmin) {
      console.log("❌ User is not admin or role check failed");
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("✅ Starting backfill for admin user:", userEmail || userId);

    const channelName = `aviation-backfill-${crypto.randomUUID()}`;

    async function runBackfill() {
      let updated = 0;
      let skipped = 0;
      let errors = 0;

      console.log("Starting Aviation URL backfill with batch processing");

      const BATCH_SIZE = 100;
      const BATCH_DELAY_MS = 2000; // 2 second delay between batches
      const ARTICLE_DELAY_MS = 300; // 300ms delay between articles

      const { data: articles, error: fetchError } = await supabaseAdmin
        .from("articles")
        .select("id, post_id, external_url")
        .eq("vertical_slug", "aviation")
        .is("external_url", null)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching articles:", fetchError);
        throw fetchError;
      }

      if (!articles || articles.length === 0) {
        console.log("No Aviation articles found to backfill");
        return { updated: 0, skipped: 0, errors: 0 };
      }

      const totalArticles = articles.length;
      const totalBatches = Math.ceil(totalArticles / BATCH_SIZE);
      console.log(`Found ${totalArticles} Aviation articles to process in ${totalBatches} batches`);

      // Process articles in batches
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * BATCH_SIZE;
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalArticles);
        const batch = articles.slice(batchStart, batchEnd);

        console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (articles ${batchStart + 1}-${batchEnd})`);

        for (let i = 0; i < batch.length; i++) {
          const article = batch[i];
          const overallIndex = batchStart + i;

          try {
            // Send progress update
            await supabaseAdmin.channel(channelName).send({
              type: "broadcast",
              event: "progress",
              payload: {
                phase: "processing",
                currentArticle: overallIndex + 1,
                totalArticles,
                updated,
                skipped,
                errors,
                percentage: Math.round(((overallIndex + 1) / totalArticles) * 100),
              } satisfies ProgressUpdate,
            });

            // Skip if already has external_url (shouldn't happen with the query filter, but double-check)
            if (article.external_url && article.external_url.trim() !== "") {
              console.log(`Article ${article.id} already has external_url, skipping`);
              skipped++;
              continue;
            }

            // Skip if no post_id
            if (!article.post_id) {
              console.log(`Article ${article.id} has no post_id, skipping`);
              skipped++;
              continue;
            }

            // Fetch article data from Aviation API
            const aviationUrl = `https://platodata.ai/aviation/json/?p=${article.post_id}`;
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

            // Update article with source URL
            const { error: updateError } = await supabaseAdmin
              .from("articles")
              .update({ external_url: sourceUrl })
              .eq("id", article.id);

            if (updateError) {
              console.error(`Error updating article ${article.id}:`, updateError);
              errors++;
            } else {
              updated++;
              if (updated % 10 === 0) {
                console.log(`Progress: ${updated} articles updated so far`);
              }
            }

            // Small delay between articles
            await new Promise((resolve) => setTimeout(resolve, ARTICLE_DELAY_MS));
          } catch (error) {
            console.error(`Error processing article ${article.id}:`, error);
            errors++;
          }
        }

        // Delay between batches (except for the last batch)
        if (batchIndex < totalBatches - 1) {
          console.log(`Batch ${batchIndex + 1} complete. Waiting ${BATCH_DELAY_MS}ms before next batch...`);
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
        }
      }

      // Send completion event
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

      console.log("Aviation URL backfill complete", { 
        totalArticles,
        updated, 
        skipped, 
        errors,
        successRate: `${((updated / totalArticles) * 100).toFixed(2)}%`
      });

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

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify admin
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError) throw claimsError;

    const userId = claims?.claims?.sub;
    if (!userId) throw new Error("No user ID");

    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sourceVertical, targetVertical, limit = 100, dryRun = true } = await req.json();

    if (!sourceVertical || !targetVertical) {
      return new Response(JSON.stringify({ error: "sourceVertical and targetVertical required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get articles from source
    const { data: articles, error: fetchError } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("vertical_slug", sourceVertical)
      .limit(limit);

    if (fetchError) throw fetchError;

    if (dryRun) {
      return new Response(JSON.stringify({
        message: "Dry run complete",
        articleCount: articles?.length || 0,
        sourceVertical,
        targetVertical,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Migrate: update vertical_slug
    let migrated = 0;
    for (const article of articles || []) {
      const { error } = await supabaseAdmin
        .from("articles")
        .update({ vertical_slug: targetVertical })
        .eq("id", article.id);
      if (!error) migrated++;
    }

    return new Response(JSON.stringify({
      message: "Migration complete",
      migrated,
      total: articles?.length || 0,
      sourceVertical,
      targetVertical,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

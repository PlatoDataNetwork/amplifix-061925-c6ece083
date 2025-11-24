import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabaseClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting to delete all aerospace articles");

    // First, get all aerospace article IDs
    const { data: articles, error: fetchError } = await supabaseAdmin
      .from("articles")
      .select("id")
      .eq("vertical_slug", "aerospace");

    if (fetchError) {
      console.error("Error fetching aerospace articles:", fetchError);
      throw fetchError;
    }

    const articleCount = articles?.length || 0;
    console.log(`Found ${articleCount} aerospace articles to delete`);

    if (articleCount === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No aerospace articles found to delete",
          deleted: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const articleIds = articles.map((a) => a.id);

    // Delete article_tags first
    const { error: tagDeleteError } = await supabaseAdmin
      .from("article_tags")
      .delete()
      .in("article_id", articleIds);

    if (tagDeleteError) {
      console.error("Error deleting article tags:", tagDeleteError);
      throw tagDeleteError;
    }

    // Delete articles
    const { error: deleteError } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("vertical_slug", "aerospace");

    if (deleteError) {
      console.error("Error deleting articles:", deleteError);
      throw deleteError;
    }

    console.log(`Successfully deleted ${articleCount} aerospace articles`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deleted ${articleCount} aerospace articles`,
        deleted: articleCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in clear-aerospace-articles:", error);
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

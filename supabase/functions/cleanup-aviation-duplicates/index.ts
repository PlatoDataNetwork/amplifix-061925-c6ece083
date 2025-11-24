import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

interface DuplicateGroup {
  post_id: number;
  count: number;
  ids: string[];
}

interface CleanupResult {
  duplicatesFound: number;
  duplicatesRemoved: number;
  errors: string[];
}

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

    console.log("Starting Aviation duplicate cleanup");

    // Find all Aviation articles grouped by post_id
    const { data: articles, error: fetchError } = await supabaseAdmin
      .from("articles")
      .select("id, post_id, created_at")
      .eq("vertical_slug", "aviation")
      .not("post_id", "is", null)
      .order("post_id", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching articles:", fetchError);
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      console.log("No Aviation articles found");
      return new Response(
        JSON.stringify({
          success: true,
          duplicatesFound: 0,
          duplicatesRemoved: 0,
          errors: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Group articles by post_id
    const groupedByPostId = new Map<number, string[]>();

    for (const article of articles) {
      if (!article.post_id) continue;

      if (!groupedByPostId.has(article.post_id)) {
        groupedByPostId.set(article.post_id, []);
      }
      groupedByPostId.get(article.post_id)!.push(article.id);
    }

    // Find duplicates (post_ids with more than one article)
    const duplicates: DuplicateGroup[] = [];

    for (const [post_id, ids] of groupedByPostId.entries()) {
      if (ids.length > 1) {
        duplicates.push({
          post_id,
          count: ids.length,
          ids,
        });
      }
    }

    console.log(`Found ${duplicates.length} duplicate groups`);

    const errors: string[] = [];
    let duplicatesRemoved = 0;

    // For each duplicate group, keep the first one and delete the rest
    for (const duplicate of duplicates) {
      const [keepId, ...removeIds] = duplicate.ids;

      console.log(
        `Keeping article ${keepId} for post_id ${duplicate.post_id}, removing ${removeIds.length} duplicates`
      );

      for (const removeId of removeIds) {
        try {
          // First, delete associated tags
          const { error: tagDeleteError } = await supabaseAdmin
            .from("article_tags")
            .delete()
            .eq("article_id", removeId);

          if (tagDeleteError) {
            console.error(`Error deleting tags for article ${removeId}:`, tagDeleteError);
            errors.push(`Failed to delete tags for article ${removeId}`);
            continue;
          }

          // Then delete the article
          const { error: deleteError } = await supabaseAdmin
            .from("articles")
            .delete()
            .eq("id", removeId);

          if (deleteError) {
            console.error(`Error deleting article ${removeId}:`, deleteError);
            errors.push(`Failed to delete article ${removeId}`);
          } else {
            duplicatesRemoved++;
            console.log(`Successfully deleted duplicate article ${removeId}`);
          }
        } catch (error) {
          console.error(`Exception deleting article ${removeId}:`, error);
          errors.push(`Exception deleting article ${removeId}: ${error}`);
        }
      }
    }

    const result: CleanupResult = {
      duplicatesFound: duplicates.reduce((sum, d) => sum + (d.count - 1), 0),
      duplicatesRemoved,
      errors,
    };

    console.log("Aviation duplicate cleanup complete", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in cleanup-aviation-duplicates:", error);
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

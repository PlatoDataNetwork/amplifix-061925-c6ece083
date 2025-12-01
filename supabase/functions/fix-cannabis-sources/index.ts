import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Fixing cannabis article sources...");

    // Get all cannabis articles with null external_url
    const { data: articles, error: fetchError } = await supabase
      .from("articles")
      .select("id, post_id, content, external_url, metadata")
      .eq("vertical_slug", "cannabis")
      .is("external_url", null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${articles?.length || 0} articles with null external_url`);

    let fixed = 0;
    let failed = 0;

    for (const article of articles || []) {
      try {
        let sourceUrl: string | null = null;

        // Try to extract from metadata first
        if (article.metadata?.sourceLink) {
          const sourceLink = article.metadata.sourceLink;
          sourceUrl = Array.isArray(sourceLink) ? sourceLink[0] : sourceLink;
        } else if (article.metadata?.source) {
          sourceUrl = typeof article.metadata.source === 'string' 
            ? article.metadata.source 
            : article.metadata.source[0];
        } else if (article.metadata?.sourceURL) {
          sourceUrl = typeof article.metadata.sourceURL === 'string'
            ? article.metadata.sourceURL
            : article.metadata.sourceURL[0];
        }

        // Try to extract from content
        if (!sourceUrl && article.content) {
          const match = article.content.match(/(?:Source|Read more|Original):?\s*<a[^>]+href=["']([^"']+)["']/i);
          if (match && match[1]) {
            sourceUrl = match[1];
          }
        }

        if (sourceUrl) {
          // Update the article
          const { error: updateError } = await supabase
            .from("articles")
            .update({
              external_url: sourceUrl,
              metadata: {
                ...article.metadata,
                source: sourceUrl,
              }
            })
            .eq("id", article.id);

          if (updateError) {
            console.error(`Failed to update article ${article.post_id}:`, updateError);
            failed++;
          } else {
            console.log(`Fixed article ${article.post_id}: ${sourceUrl}`);
            fixed++;
          }
        } else {
          console.log(`Could not find source for article ${article.post_id}`);
          failed++;
        }
      } catch (error) {
        console.error(`Error processing article ${article.post_id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: articles?.length || 0,
        fixed,
        failed,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fixing sources:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

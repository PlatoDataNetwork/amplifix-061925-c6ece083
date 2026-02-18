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
    const url = new URL(req.url);
    const vertical = url.searchParams.get("vertical");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    let query = supabase
      .from("articles")
      .select("id, title, excerpt, author, published_at, image_url, vertical_slug, external_url")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (vertical) {
      query = query.eq("vertical_slug", vertical);
    }

    const { data: articles, error } = await query;
    if (error) throw error;

    const siteUrl = "https://amplifix.net";

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: vertical ? `AmplifiX ${vertical} Feed` : "AmplifiX Feed",
      home_page_url: siteUrl,
      feed_url: `${siteUrl}/feed.json${vertical ? `?vertical=${vertical}` : ""}`,
      description: "Latest articles from AmplifiX Intelligence Platform",
      items: (articles || []).map((a) => ({
        id: a.id,
        title: a.title,
        url: a.external_url || `${siteUrl}/intel/article/${a.id}`,
        summary: a.excerpt || "",
        image: a.image_url || undefined,
        date_published: a.published_at,
        authors: a.author ? [{ name: a.author }] : [],
        tags: [a.vertical_slug],
      })),
    };

    return new Response(JSON.stringify(feed, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/feed+json; charset=utf-8" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

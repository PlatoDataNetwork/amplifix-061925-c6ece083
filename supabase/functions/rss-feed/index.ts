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
    const feedTitle = vertical ? `AmplifiX ${vertical} Feed` : "AmplifiX Feed";

    const items = (articles || []).map((a) => {
      const link = a.external_url || `${siteUrl}/intel/article/${a.id}`;
      return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${a.id}</guid>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      ${a.author ? `<dc:creator><![CDATA[${a.author}]]></dc:creator>` : ""}
      ${a.excerpt ? `<description><![CDATA[${a.excerpt}]]></description>` : ""}
      ${a.image_url ? `<enclosure url="${a.image_url}" type="image/jpeg" />` : ""}
      <category>${a.vertical_slug}</category>
    </item>`;
    }).join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedTitle}</title>
    <link>${siteUrl}</link>
    <description>Latest articles from AmplifiX Intelligence Platform</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss${vertical ? `?vertical=${vertical}` : ""}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: { ...corsHeaders, "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  } catch (error) {
    return new Response(`<rss version="2.0"><channel><title>Error</title></channel></rss>`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/rss+xml" },
    });
  }
});

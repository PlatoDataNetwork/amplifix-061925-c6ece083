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
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400, headers: corsHeaders });
    }

    // Extract the article ID from the slug (e.g., "some-title-123456" -> "123456")
    let articleId: string | null = null;
    
    if (/^\d+$/.test(slug)) {
      articleId = slug;
    } else {
      const match = slug.match(/-(\d+)$/);
      if (match) {
        articleId = match[1];
      }
    }

    if (!articleId) {
      return new Response("Could not extract article ID", { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: article, error } = await supabase
      .from("articles")
      .select("title, excerpt, image_url, published_at, author")
      .eq("post_id", parseInt(articleId))
      .single();

    if (error || !article) {
      // Fallback: try by UUID id
      const { data: articleById } = await supabase
        .from("articles")
        .select("title, excerpt, image_url, published_at, author")
        .eq("id", articleId)
        .single();

      if (!articleById) {
        return new Response(JSON.stringify({ error: "Article not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return buildResponse(articleById, slug);
    }

    return buildResponse(article, slug);
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildResponse(
  article: { title: string; excerpt: string | null; image_url: string | null; published_at: string; author: string | null },
  slug: string
) {
  const siteUrl = "https://www.amplifix.net";
  const articleUrl = `${siteUrl}/intel/${slug}`;
  const imageUrl = article.image_url
    ? (article.image_url.startsWith("http") ? article.image_url : `${siteUrl}${article.image_url}`)
    : `${siteUrl}/social-icon.png`;
  
  const title = stripHtml(article.title || "AmplifiX Intelligence");
  const description = stripHtml(article.excerpt || "Read the latest on AmplifiX Intelligence.");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="AmplifiX Intelligence" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  
  <meta http-equiv="refresh" content="0;url=${articleUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${articleUrl}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...({} as Record<string, string>),
    },
  });
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

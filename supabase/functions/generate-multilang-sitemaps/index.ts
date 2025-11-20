import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languages = [
  'ar', 'bn', 'zh', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'de', 'el', 'he', 
  'hi', 'hu', 'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 
  'ro', 'ru', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'
];

const routes = [
  '/',
  '/about',
  '/solutions',
  '/showcase',
  '/intel',
  '/faq',
  '/contact',
  '/pricing',
  '/public-companies',
  '/private-companies',
  '/ipo-preparation',
  '/fundraising',
];

function generateSitemap(lang: string, baseUrl: string): string {
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  
  const urlEntries = routes.map(route => {
    const loc = `${baseUrl}${langPrefix}${route}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(baseUrl: string): string {
  const sitemapEntries = languages.map(lang => {
    const filename = lang === 'en' ? 'sitemap.xml' : `sitemap-${lang}.xml`;
    return `  <sitemap>
    <loc>${baseUrl}/${filename}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const baseUrl = 'https://amplifix.net';
    const { lang, type } = await req.json();

    console.log('Generating sitemap:', { lang, type });

    if (type === 'index') {
      const sitemapIndex = generateSitemapIndex(baseUrl);
      return new Response(
        JSON.stringify({ 
          success: true, 
          content: sitemapIndex,
          filename: 'sitemap-index.xml'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (lang && languages.includes(lang)) {
      const sitemap = generateSitemap(lang, baseUrl);
      const filename = lang === 'en' ? 'sitemap.xml' : `sitemap-${lang}.xml`;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          content: sitemap,
          filename
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate all sitemaps
    const allSitemaps = languages.map(language => ({
      lang: language,
      filename: language === 'en' ? 'sitemap.xml' : `sitemap-${language}.xml`,
      content: generateSitemap(language, baseUrl)
    }));

    allSitemaps.push({
      lang: 'index',
      filename: 'sitemap-index.xml',
      content: generateSitemapIndex(baseUrl)
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        sitemaps: allSitemaps 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating sitemaps:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

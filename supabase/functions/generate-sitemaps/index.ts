import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supportedLanguages = [
  { code: 'en', domain: 'amplifix.net' },
  { code: 'es', domain: 'es.amplifix.net' },
  { code: 'fr', domain: 'fr.amplifix.net' },
  { code: 'de', domain: 'de.amplifix.net' },
  { code: 'it', domain: 'it.amplifix.net' },
  { code: 'pt', domain: 'pt.amplifix.net' },
  { code: 'zh', domain: 'zh.amplifix.net' },
  { code: 'ja', domain: 'ja.amplifix.net' },
  { code: 'ko', domain: 'ko.amplifix.net' },
  { code: 'ar', domain: 'ar.amplifix.net' },
  { code: 'ru', domain: 'ru.amplifix.net' },
  { code: 'hi', domain: 'hi.amplifix.net' },
  { code: 'nl', domain: 'nl.amplifix.net' },
  { code: 'sv', domain: 'sv.amplifix.net' },
  { code: 'tr', domain: 'tr.amplifix.net' },
];

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/showcase', priority: '0.9', changefreq: 'weekly' },
  { path: '/intel', priority: '0.8', changefreq: 'daily' },
  { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { path: '/api', priority: '0.7', changefreq: 'monthly' },
  { path: '/support', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/solutions/public-companies', priority: '0.7', changefreq: 'monthly' },
  { path: '/solutions/private-companies', priority: '0.7', changefreq: 'monthly' },
  { path: '/solutions/ipo-preparation', priority: '0.7', changefreq: 'monthly' },
  { path: '/solutions/fundraising', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/silo-pharma', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/karbon-x', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/international-land-alliance', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/synbio', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/micropolis', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/facial-dx', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/fynn-ai', priority: '0.7', changefreq: 'monthly' },
  { path: '/showcase/abatis', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
  { path: '/data-processing', priority: '0.3', changefreq: 'yearly' },
  { path: '/compliance', priority: '0.3', changefreq: 'yearly' },
];

function generateSitemapXML(urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }>) {
  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

// Generate URL slug from title
function generateSlug(title: string): string {
  return title
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&[a-z]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
    .replace(/-+$/, '');
}

function generateSitemapIndex() {
  const today = new Date().toISOString().split('T')[0];
  const sitemaps = supportedLanguages.map(lang => `  <sitemap>
    <loc>https://${lang.domain}/sitemap-${lang.code}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = 'https://rfkdcmvzvxcsoecoeddi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body = await req.json();
    const { lang: langCode, type } = body;

    console.log('Request params:', { langCode, type });

    // Generate sitemap index
    if (type === 'index') {
      const sitemapIndexXML = generateSitemapIndex();
      return new Response(sitemapIndexXML, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Generate language-specific sitemap
    if (!langCode || !supportedLanguages.find(l => l.code === langCode)) {
      console.error('Invalid or missing language code:', langCode);
      throw new Error('Invalid or missing language code. Please provide a valid language code.');
    }

    const language = supportedLanguages.find(l => l.code === langCode)!;
    const baseUrl = `https://${language.domain}`;
    const today = new Date().toISOString().split('T')[0];

    // Get all articles from database
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, post_id, vertical_slug, updated_at, published_at')
      .order('published_at', { ascending: false });

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      throw articlesError;
    }

    // Get all unique verticals
    const { data: verticals, error: verticalsError } = await supabase
      .rpc('get_vertical_article_counts');

    const verticalSlugs = verticals?.map(v => v.vertical_slug) || [];

    // Build URLs array
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

    // Add static routes
    staticRoutes.forEach(route => {
      const path = langCode === 'en' ? route.path : `/${langCode}${route.path}`;
      urls.push({
        loc: langCode === 'en' ? `https://amplifix.net${route.path}` : `${baseUrl}${route.path}`,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
      });
    });

    // Add vertical pages
    verticalSlugs.forEach(slug => {
      const path = langCode === 'en' ? `/intel/${slug}` : `/${langCode}/intel/${slug}`;
      urls.push({
        loc: langCode === 'en' ? `https://amplifix.net/intel/${slug}` : `${baseUrl}/intel/${slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.8',
      });
    });

    // Add article pages
    articles?.forEach(article => {
      const articleId = article.post_id || article.id;
      const lastmod = article.updated_at 
        ? new Date(article.updated_at).toISOString().split('T')[0]
        : new Date(article.published_at).toISOString().split('T')[0];
      
      const path = langCode === 'en' 
        ? `/intel/external/${articleId}` 
        : `/${langCode}/intel/external/${articleId}`;
      
        const slug = generateSlug(article.title);
        urls.push({
          loc: langCode === 'en' 
            ? `https://amplifix.net/intel/${slug}-${articleId}` 
            : `${baseUrl}/intel/${slug}-${articleId}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.7',
        });
    });

    const sitemapXML = generateSitemapXML(urls);

    return new Response(sitemapXML, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

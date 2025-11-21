import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const BATCH_SIZE = 1000;
const BASE_URL = 'https://www.amplifix.net';

const SUPPORTED_LANGUAGES = [
  'ar', 'bn', 'da', 'de', 'el', 'es', 'et', 'fi', 'fr', 
  'he', 'hi', 'hu', 'it', 'ja', 'ko', 'nl', 'pa', 'pt', 
  'ru', 'sv', 'tr', 'zh'
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

function generateSitemapXML(urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string; alternates?: Array<{ lang: string; url: string }> }>) {
  const urlEntries = urls.map(url => {
    let alternateLinks = '';
    if (url.alternates) {
      alternateLinks = url.alternates.map(alt => 
        `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />`
      ).join('\n');
    }
    
    return `  <url>
    <loc>${url.loc}</loc>
${alternateLinks ? alternateLinks + '\n' : ''}    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

function getLanguageBaseUrl(lang: string): string {
  return `https://${lang}.amplifix.net`;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const langParam = url.searchParams.get('lang');
    
    if (!langParam || !SUPPORTED_LANGUAGES.includes(langParam)) {
      return new Response('Invalid or missing language parameter', { status: 400 });
    }

    const supabaseUrl = 'https://rfkdcmvzvxcsoecoeddi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    const langBaseUrl = getLanguageBaseUrl(langParam);
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string; alternates?: Array<{ lang: string; url: string }> }> = [];

    // Add static routes with language prefix
    staticRoutes.forEach(route => {
      const alternates = [
        { lang: 'en', url: `${BASE_URL}${route.path}` },
        { lang: langParam, url: `${langBaseUrl}${route.path}` }
      ];
      
      urls.push({
        loc: `${langBaseUrl}${route.path}`,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
        alternates,
      });
    });

    // Add vertical pages
    const { data: verticals } = await supabase.rpc('get_vertical_article_counts');
    const verticalSlugs = verticals?.map(v => v.vertical_slug) || [];
    
    verticalSlugs.forEach(slug => {
      const alternates = [
        { lang: 'en', url: `${BASE_URL}/intel/${slug}` },
        { lang: langParam, url: `${langBaseUrl}/intel/${slug}` }
      ];
      
      urls.push({
        loc: `${langBaseUrl}/intel/${slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.8',
        alternates,
      });
    });

    // Fetch all articles (up to BATCH_SIZE for this language sitemap)
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, post_id, vertical_slug, updated_at, published_at')
      .order('published_at', { ascending: false })
      .limit(BATCH_SIZE);

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      throw articlesError;
    }

    // Add article URLs
    articles?.forEach(article => {
      const articleId = article.post_id || article.id;
      const lastmod = article.updated_at 
        ? new Date(article.updated_at).toISOString().split('T')[0]
        : new Date(article.published_at).toISOString().split('T')[0];
      
      const alternates = [
        { lang: 'en', url: `${BASE_URL}/intel/external/${articleId}` },
        { lang: langParam, url: `${langBaseUrl}/intel/external/${articleId}` }
      ];
      
      urls.push({
        loc: `${langBaseUrl}/intel/external/${articleId}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.7',
        alternates,
      });
    });

    const sitemapXML = generateSitemapXML(urls);

    return new Response(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating language sitemap:', error);
    return new Response('Error generating language sitemap', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
});

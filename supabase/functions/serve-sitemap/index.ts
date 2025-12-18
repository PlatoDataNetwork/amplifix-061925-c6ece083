import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const BATCH_SIZE = 1000;
const BASE_URL = 'https://www.amplifix.net';

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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateSitemapXML(urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }>) {
  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const batchParam = url.searchParams.get('batch');
    
    if (!batchParam) {
      return new Response('Missing batch parameter', { status: 400 });
    }

    const batchIndex = parseInt(batchParam) - 1;

    const supabaseUrl = 'https://rfkdcmvzvxcsoecoeddi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    const batchUrls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

    // For the first batch, add static routes and vertical pages
    if (batchIndex === 0) {
      // Add static routes
      staticRoutes.forEach(route => {
        batchUrls.push({
          loc: `${BASE_URL}${route.path}`,
          lastmod: today,
          changefreq: route.changefreq,
          priority: route.priority,
        });
      });

      // Add vertical pages
      const { data: verticals } = await supabase.rpc('get_vertical_article_counts');
      const verticalSlugs = verticals?.map(v => v.vertical_slug) || [];
      
      verticalSlugs.forEach(slug => {
        batchUrls.push({
          loc: `${BASE_URL}/intel/${slug}`,
          lastmod: today,
          changefreq: 'daily',
          priority: '0.8',
        });
      });
    }

    // Fetch articles for this batch
    const from = batchIndex * BATCH_SIZE;
    const to = from + BATCH_SIZE - 1;

    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, post_id, title, vertical_slug, updated_at, published_at')
      .order('published_at', { ascending: false })
      .range(from, to);

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      throw articlesError;
    }

    // Add article URLs
    articles?.forEach(article => {
      const articleId = article.post_id || article.id;
      const slug = generateSlug(article.title);
      const lastmod = article.updated_at 
        ? new Date(article.updated_at).toISOString().split('T')[0]
        : new Date(article.published_at).toISOString().split('T')[0];
      
      batchUrls.push({
        loc: `${BASE_URL}/intel/${slug}-${articleId}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.7',
      });
    });

    const sitemapXML = generateSitemapXML(batchUrls);

    return new Response(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
});

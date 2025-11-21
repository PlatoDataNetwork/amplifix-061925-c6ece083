import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BATCH_SIZE = 1000;
const BASE_URL = 'http://amplifix.net';

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(batchCount: number) {
  const today = new Date().toISOString().split('T')[0];
  const sitemaps = [];
  
  for (let i = 1; i <= batchCount; i++) {
    sitemaps.push(`  <sitemap>
    <loc>${BASE_URL}/sitemap-${i}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
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

    const today = new Date().toISOString().split('T')[0];

    console.log('Starting batched sitemap generation for English...');

    // Get total article count
    const { count: totalArticles, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting articles:', countError);
      throw countError;
    }

    console.log(`Total articles: ${totalArticles}`);

    // Calculate number of batches
    const batchCount = Math.ceil((totalArticles || 0) / BATCH_SIZE);
    console.log(`Will generate ${batchCount} sitemap files`);

    // Get all unique verticals
    const { data: verticals } = await supabase.rpc('get_vertical_article_counts');
    const verticalSlugs = verticals?.map(v => v.vertical_slug) || [];

    // Array to hold all sitemap files
    const sitemapFiles = [];

    // Generate first batch with static routes and vertical pages
    const firstBatchUrls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

    // Add static routes to first batch
    staticRoutes.forEach(route => {
      firstBatchUrls.push({
        loc: `${BASE_URL}${route.path}`,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
      });
    });

    // Add vertical pages to first batch
    verticalSlugs.forEach(slug => {
      firstBatchUrls.push({
        loc: `${BASE_URL}/intel/${slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.8',
      });
    });

    // Fetch and add articles in batches
    for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
      const from = batchIndex * BATCH_SIZE;
      const to = from + BATCH_SIZE - 1;

      console.log(`Processing batch ${batchIndex + 1}/${batchCount} (articles ${from}-${to})`);

      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, post_id, vertical_slug, updated_at, published_at')
        .order('published_at', { ascending: false })
        .range(from, to);

      if (articlesError) {
        console.error(`Error fetching batch ${batchIndex + 1}:`, articlesError);
        throw articlesError;
      }

      const batchUrls = batchIndex === 0 ? [...firstBatchUrls] : [];

      // Add article URLs
      articles?.forEach(article => {
        const articleId = article.post_id || article.id;
        const lastmod = article.updated_at 
          ? new Date(article.updated_at).toISOString().split('T')[0]
          : new Date(article.published_at).toISOString().split('T')[0];
        
        batchUrls.push({
          loc: `${BASE_URL}/intel/external/${articleId}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.7',
        });
      });

      const sitemapXML = generateSitemapXML(batchUrls);
      sitemapFiles.push({
        filename: `sitemap-${batchIndex + 1}.xml`,
        content: sitemapXML,
        urlCount: batchUrls.length
      });

      console.log(`Generated sitemap-${batchIndex + 1}.xml with ${batchUrls.length} URLs`);
    }

    // Generate sitemap index
    const sitemapIndexXML = generateSitemapIndex(batchCount);
    sitemapFiles.push({
      filename: 'sitemap_index.xml',
      content: sitemapIndexXML,
      urlCount: batchCount
    });

    console.log('Generated sitemap_index.xml');

    // Return all sitemaps
    return new Response(JSON.stringify({
      success: true,
      message: 'Sitemaps generated successfully',
      totalArticles,
      batchCount,
      sitemapIndexUrl: `${BASE_URL}/sitemap_index.xml`,
      files: sitemapFiles
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error generating sitemaps:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

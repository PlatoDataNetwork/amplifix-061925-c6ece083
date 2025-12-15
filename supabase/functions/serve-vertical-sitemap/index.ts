import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const BATCH_SIZE = 1000;
const BASE_URL = 'https://www.amplifix.net';

const SUPPORTED_LANGUAGES = [
  'ar', 'bn', 'da', 'de', 'el', 'es', 'et', 'fi', 'fr', 
  'he', 'hi', 'hu', 'it', 'ja', 'ko', 'nl', 'pa', 'pt', 
  'ru', 'sv', 'tr', 'zh'
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getLanguageBaseUrl(lang: string): string {
  return `https://${lang}.amplifix.net`;
}

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

function generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod: string }>) {
  const sitemapEntries = sitemaps.map(sitemap => 
    `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const verticalParam = url.searchParams.get('vertical');
    const langParam = url.searchParams.get('lang');
    const batchParam = url.searchParams.get('batch');
    const indexParam = url.searchParams.get('index');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://rfkdcmvzvxcsoecoeddi.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    const functionUrl = `${supabaseUrl}/functions/v1/serve-vertical-sitemap`;

    // If requesting master index (all verticals, all languages)
    if (indexParam === 'master') {
      console.log('Generating master sitemap index for all verticals...');
      
      // Get all verticals with article counts
      const { data: verticals, error: verticalsError } = await supabase.rpc('get_vertical_article_counts');
      
      if (verticalsError) {
        console.error('Error getting verticals:', verticalsError);
        throw verticalsError;
      }

      const sitemaps: Array<{ loc: string; lastmod: string }> = [];

      // Generate sitemap entries for each vertical
      for (const vertical of verticals || []) {
        const totalBatches = Math.ceil(Number(vertical.article_count) / BATCH_SIZE);
        
        // Add English sitemaps
        for (let batch = 0; batch < totalBatches; batch++) {
          sitemaps.push({
            loc: `${functionUrl}?vertical=${vertical.vertical_slug}&lang=en&batch=${batch}`,
            lastmod: today,
          });
        }
        
        // Add other language sitemaps
        for (const lang of SUPPORTED_LANGUAGES) {
          for (let batch = 0; batch < totalBatches; batch++) {
            sitemaps.push({
              loc: `${functionUrl}?vertical=${vertical.vertical_slug}&lang=${lang}&batch=${batch}`,
              lastmod: today,
            });
          }
        }
      }

      const sitemapIndexXML = generateSitemapIndex(sitemaps);

      return new Response(sitemapIndexXML, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // If requesting vertical-specific index (all languages for one vertical)
    if (indexParam === 'true' && verticalParam) {
      console.log(`Generating sitemap index for ${verticalParam}...`);
      
      // Get article count for this vertical
      const { count, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', verticalParam);

      if (countError) {
        console.error('Error getting article count:', countError);
        throw countError;
      }

      const totalArticles = count || 0;
      const totalBatches = Math.ceil(totalArticles / BATCH_SIZE);
      
      console.log(`Total ${verticalParam} articles: ${totalArticles}, batches needed: ${totalBatches}`);

      const sitemaps: Array<{ loc: string; lastmod: string }> = [];

      // Add English sitemaps first
      for (let batch = 0; batch < totalBatches; batch++) {
        sitemaps.push({
          loc: `${functionUrl}?vertical=${verticalParam}&lang=en&batch=${batch}`,
          lastmod: today,
        });
      }

      // Generate sitemap entries for each language and batch
      for (const lang of SUPPORTED_LANGUAGES) {
        for (let batch = 0; batch < totalBatches; batch++) {
          sitemaps.push({
            loc: `${functionUrl}?vertical=${verticalParam}&lang=${lang}&batch=${batch}`,
            lastmod: today,
          });
        }
      }

      const sitemapIndexXML = generateSitemapIndex(sitemaps);

      return new Response(sitemapIndexXML, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Validate required parameters for individual sitemaps
    if (!verticalParam) {
      return new Response('Missing vertical parameter. Use ?index=master for all verticals, ?vertical=X&index=true for vertical index, or ?vertical=X&lang=XX&batch=N for specific sitemap', { status: 400 });
    }

    if (!langParam) {
      return new Response('Missing language parameter. Use ?lang=XX', { status: 400 });
    }

    const isEnglish = langParam === 'en';
    if (!isEnglish && !SUPPORTED_LANGUAGES.includes(langParam)) {
      return new Response(`Invalid language: ${langParam}`, { status: 400 });
    }

    const batchIndex = parseInt(batchParam || '0', 10);
    const from = batchIndex * BATCH_SIZE;
    const to = from + BATCH_SIZE - 1;

    console.log(`Generating ${verticalParam} sitemap for lang=${langParam}, batch=${batchIndex} (articles ${from}-${to})`);

    const langBaseUrl = isEnglish ? BASE_URL : getLanguageBaseUrl(langParam);
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string; alternates?: Array<{ lang: string; url: string }> }> = [];

    // Add vertical page for first batch
    if (batchIndex === 0) {
      const alternates = [
        { lang: 'en', url: `${BASE_URL}/intel/${verticalParam}` },
        ...SUPPORTED_LANGUAGES.map(l => ({ lang: l, url: `${getLanguageBaseUrl(l)}/intel/${verticalParam}` }))
      ];
      
      urls.push({
        loc: `${langBaseUrl}/intel/${verticalParam}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.9',
        alternates,
      });
    }

    // Fetch articles for this batch
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, post_id, title, updated_at, published_at')
      .eq('vertical_slug', verticalParam)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (articlesError) {
      console.error(`Error fetching ${verticalParam} articles:`, articlesError);
      throw articlesError;
    }

    console.log(`Fetched ${articles?.length || 0} ${verticalParam} articles for batch ${batchIndex}`);

    // Add article URLs with language alternates
    articles?.forEach(article => {
      const articleId = article.post_id || article.id;
      const slug = generateSlug(article.title);
      const lastmod = article.updated_at 
        ? new Date(article.updated_at).toISOString().split('T')[0]
        : new Date(article.published_at).toISOString().split('T')[0];
      
      const articlePath = `/intel/external/${slug}/${articleId}`;
      
      const alternates = [
        { lang: 'en', url: `${BASE_URL}${articlePath}` },
        ...SUPPORTED_LANGUAGES.map(l => ({ lang: l, url: `${getLanguageBaseUrl(l)}${articlePath}` }))
      ];
      
      urls.push({
        loc: `${langBaseUrl}${articlePath}`,
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
    console.error('Error generating vertical sitemap:', error);
    return new Response(`Error generating sitemap: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
});

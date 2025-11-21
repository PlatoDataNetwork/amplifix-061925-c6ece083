import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const BATCH_SIZE = 1000;
const BASE_URL = 'https://www.amplifix.net';

const LANGUAGE_SITEMAPS = [
  { lang: 'es', url: 'https://es.amplifix.net/sitemap-es.xml' },
  { lang: 'fr', url: 'https://fr.amplifix.net/sitemap-fr.xml' },
  { lang: 'de', url: 'https://de.amplifix.net/sitemap-de.xml' },
  { lang: 'zh', url: 'https://zh.amplifix.net/sitemap-zh.xml' },
  { lang: 'ja', url: 'https://ja.amplifix.net/sitemap-ja.xml' },
  { lang: 'ko', url: 'https://ko.amplifix.net/sitemap-ko.xml' },
  { lang: 'pt', url: 'https://pt.amplifix.net/sitemap-pt.xml' },
  { lang: 'it', url: 'https://it.amplifix.net/sitemap-it.xml' },
  { lang: 'nl', url: 'https://nl.amplifix.net/sitemap-nl.xml' },
  { lang: 'ru', url: 'https://ru.amplifix.net/sitemap-ru.xml' },
  { lang: 'ar', url: 'https://ar.amplifix.net/sitemap-ar.xml' },
  { lang: 'hi', url: 'https://hi.amplifix.net/sitemap-hi.xml' },
  { lang: 'tr', url: 'https://tr.amplifix.net/sitemap-tr.xml' },
  { lang: 'sv', url: 'https://sv.amplifix.net/sitemap-sv.xml' },
];

function generateSitemapIndex(batchCount: number) {
  const today = new Date().toISOString().split('T')[0];
  const sitemaps = [];
  
  // Add main English sitemaps
  for (let i = 1; i <= batchCount; i++) {
    sitemaps.push(`  <sitemap>
    <loc>${BASE_URL}/sitemap-${i}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`);
  }

  // Add language-specific sitemaps
  LANGUAGE_SITEMAPS.forEach(({ url }) => {
    sitemaps.push(`  <sitemap>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;
}

Deno.serve(async (req) => {
  try {
    const supabaseUrl = 'https://rfkdcmvzvxcsoecoeddi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total article count
    const { count: totalArticles } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    // Calculate number of batches
    const batchCount = Math.ceil((totalArticles || 0) / BATCH_SIZE);

    const sitemapIndexXML = generateSitemapIndex(batchCount);

    return new Response(sitemapIndexXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new Response('Error generating sitemap index', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
});

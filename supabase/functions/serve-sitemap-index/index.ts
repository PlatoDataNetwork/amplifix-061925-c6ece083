import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const BATCH_SIZE = 1000;
const BASE_URL = 'https://www.amplifix.net';

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

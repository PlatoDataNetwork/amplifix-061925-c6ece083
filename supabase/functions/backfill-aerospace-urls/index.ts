import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Article {
  id: string;
  post_id: number;
  title: string;
}

// Extract source URL from Plato Data article HTML
async function extractSourceUrl(postId: number): Promise<string | null> {
  try {
    const url = `https://platodata.ai/aerospace/${postId}/`;
    console.log(`Fetching article page: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Look for source link patterns in the HTML
    // Pattern 1: Look for "Source:" or "Read more at:" followed by a link
    const sourcePatterns = [
      /<a[^>]*href=["']([^"']+)["'][^>]*>.*?(?:Source|Read more|Original article|View original)/i,
      /(?:Source|Read more at|Original article):\s*<a[^>]*href=["']([^"']+)["']/i,
      /<span[^>]*class=["'][^"']*source[^"']*["'][^>]*>.*?<a[^>]*href=["']([^"']+)["']/i,
    ];
    
    for (const pattern of sourcePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const sourceUrl = match[1];
        // Validate it's a real URL
        if (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://')) {
          console.log(`✓ Found source URL: ${sourceUrl}`);
          return sourceUrl;
        }
      }
    }
    
    console.log(`No source URL found for post ${postId}`);
    return null;
  } catch (error) {
    console.error(`Error extracting source URL for post ${postId}:`, error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { batchSize = 50, delayMs = 1000 } = await req.json().catch(() => ({}));

    console.log(`🔄 Starting aerospace URL backfill (batch size: ${batchSize}, delay: ${delayMs}ms)`);

    // Fetch aerospace articles without external_url
    const { data: articles, error: fetchError } = await supabaseClient
      .from('articles')
      .select('id, post_id, title')
      .eq('vertical_slug', 'aerospace')
      .is('external_url', null)
      .not('post_id', 'is', null)
      .order('published_at', { ascending: false })
      .limit(batchSize);

    if (fetchError) {
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No aerospace articles need URL backfill',
          processed: 0,
          updated: 0,
          failed: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📊 Found ${articles.length} aerospace articles to process`);

    let updated = 0;
    let failed = 0;

    // Process each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i] as Article;
      
      try {
        console.log(`\n[${i + 1}/${articles.length}] Processing: ${article.title.substring(0, 60)}...`);
        
        const sourceUrl = await extractSourceUrl(article.post_id);
        
        if (sourceUrl) {
          // Update article with source URL
          const { error: updateError } = await supabaseClient
            .from('articles')
            .update({ external_url: sourceUrl })
            .eq('id', article.id);
          
          if (updateError) {
            console.error(`Error updating article ${article.id}:`, updateError);
            failed++;
          } else {
            updated++;
            console.log(`✓ Updated article ${article.id} with source URL`);
          }
        } else {
          console.log(`⚠ No source URL found for article ${article.id}`);
          failed++;
        }
        
        // Add delay to avoid rate limiting
        if (i < articles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
        failed++;
      }
    }

    const summary = {
      success: true,
      message: `Processed ${articles.length} aerospace articles`,
      processed: articles.length,
      updated,
      failed,
      remaining: updated < articles.length ? 'More articles need processing' : 'All done',
    };

    console.log('\n📊 Summary:', summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in backfill function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

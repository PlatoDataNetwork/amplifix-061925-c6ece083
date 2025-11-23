import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Article {
  id: string;
  post_id: number;
  title: string;
  external_url: string | null;
  content: string | null;
}

// Extract source URL from Plato article HTML content
function extractSourceUrlFromContent(content: string): string | null {
  if (!content) return null;

  // Find all href attributes in the HTML
  const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  const matches = [...content.matchAll(linkPattern)];

  if (matches.length === 0) return null;

  for (const match of matches) {
    let href = match[1];

    // Clean up common encoding artifacts from the JSON feed
    href = href
      .replace(/\\\"/g, "")
      .replace(/\%22/g, "")
      .replace(/\\\\\//g, "/")
      .replace(/\\\//g, "/");

    // Look for an inner non-Plato URL inside the href
    const innerMatch = href.match(/https?:\/\/(?!platodata\.ai)[^"']+/i);
    if (!innerMatch) {
      continue;
    }

    let url = innerMatch[0];

    // Normalize excessive slashes that sometimes appear in the JSON
    url = url.replace(/([^:])\/{2,}/g, "$1/");

    // Preferred news domains (for prioritization, not strict filtering)
    const preferredDomains = [
      "spacenews.com",
      "spaceflightnow.com",
      "nasa.gov",
      "esa.int",
      "space.com",
      "arstechnica.com",
      "reuters.com",
      "bloomberg.com",
      "cnbc.com",
      "theverge.com",
      "techcrunch.com",
      "spaceref.com",
    ];

    const hasPreferredDomain = preferredDomains.some((domain) =>
      url.includes(domain)
    );

    if (hasPreferredDomain) {
      return url;
    }

    // Fallback: return the first non-Plato external URL we find
    return url;
  }

  return null;
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

    const { batchSize = 50, delayMs = 200 } = await req.json().catch(() => ({}));

    console.log(`🔄 Starting aerospace URL backfill (batch size: ${batchSize}, delay: ${delayMs}ms)`);

    // Get authorization header for realtime broadcasting
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Set up realtime channel for progress updates
    const progressChannel = supabaseClient.channel('aerospace-url-backfill-progress');
    await progressChannel.subscribe();

    const broadcastProgress = async (data: any) => {
      await progressChannel.send({
        type: 'broadcast',
        event: 'progress',
        payload: data
      });
    };

    // Fetch aerospace articles without external_url OR with platodata.ai URLs
    const { data: articles, error: fetchError } = await supabaseClient
      .from('articles')
      .select('id, post_id, title, external_url, content')
      .eq('vertical_slug', 'aerospace')
      .not('post_id', 'is', null)
      .or('external_url.is.null,external_url.ilike.%platodata.ai%')
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

    // Broadcast initial progress
    await broadcastProgress({
      phase: 'starting',
      total: articles.length,
      updated: 0,
      failed: 0,
      percentComplete: 0
    });

    // Process each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i] as Article;
      
      try {
        const hasPlato = article.external_url?.includes('platodata.ai');
        const status = !article.external_url ? 'missing' : hasPlato ? 'cleaning' : 'skip';
        console.log(`\n[${i + 1}/${articles.length}] Processing (${status}): ${article.title.substring(0, 60)}...`);
        
        // Broadcast progress for this article
        await broadcastProgress({
          phase: 'processing',
          total: articles.length,
          current: i + 1,
          currentTitle: article.title.substring(0, 60),
          updated,
          failed,
          percentComplete: Math.round(((i + 1) / articles.length) * 100)
        });
        
        if (article.external_url && !hasPlato) {
          console.log(`⊗ Skipping - already has non-Plato URL: ${article.external_url}`);
          continue;
        }
        
        if (hasPlato) {
          console.log(`⚠ Current URL is Plato Data: ${article.external_url}`);
        }
        
        // Fetch fresh Plato JSON for this post_id to get raw content with source link
        let sourceUrl: string | null = null;

        try {
          const feedUrl = `https://platodata.ai/aerospace/json/?post_id=${article.post_id}`;
          console.log(`Fetching Plato JSON for post_id ${article.post_id}: ${feedUrl}`);
          const response = await fetch(feedUrl);

          if (!response.ok) {
            console.log(`Failed to fetch Plato JSON for post ${article.post_id}: ${response.status}`);
          } else {
            const json = await response.json().catch((err) => {
              console.error('Error parsing Plato JSON:', err);
              return null;
            });

            const rawContent = json?.posts?.[0]?.content as string | undefined;
            if (rawContent) {
              sourceUrl = extractSourceUrlFromContent(rawContent);
            } else {
              console.log(`No content field in Plato JSON for post ${article.post_id}`);
            }
          }
        } catch (err) {
          console.error(`Error fetching Plato JSON for post ${article.post_id}:`, err);
        }
        
        if (sourceUrl) {
          console.log(`✓ Found source URL: ${sourceUrl}`);
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
            console.log(`✓ Updated article ${article.id} with source URL: ${sourceUrl}`);
          }
        } else {
          console.log(`⚠ No source URL found for article ${article.id} (post_id ${article.post_id})`);
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

    // Broadcast final progress
    await broadcastProgress({
      phase: 'complete',
      total: articles.length,
      updated,
      failed,
      percentComplete: 100
    });

    // Clean up channel
    await supabaseClient.removeChannel(progressChannel);

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

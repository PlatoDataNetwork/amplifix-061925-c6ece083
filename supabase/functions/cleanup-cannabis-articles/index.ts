import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clean text by removing HTML tags and artifacts
function cleanText(text?: string | null): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Format article with AI
async function formatArticleWithAI(text: string): Promise<string> {
  const apiKey = Deno.env.get('LOVABLE_AI_API_KEY');
  
  if (!apiKey) {
    console.log('No LOVABLE_AI_API_KEY found, using fallback formatting');
    return fallbackFormatting(text);
  }

  try {
    const response = await fetch('https://api.lovable.app/v1/ai/format-article', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.log(`AI API error: ${response.status}, using fallback`);
      return fallbackFormatting(text);
    }

    const result = await response.json();
    return result.formatted || fallbackFormatting(text);
  } catch (error) {
    console.log(`AI formatting error: ${error.message}, using fallback`);
    return fallbackFormatting(text);
  }
}

// Fallback formatting
function fallbackFormatting(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs: string[] = [];
  
  for (let i = 0; i < sentences.length; i += 3) {
    const group = sentences.slice(i, i + 3).join(' ').trim();
    if (group) {
      paragraphs.push(`<p>${group}</p>`);
    }
  }
  
  return paragraphs.join('\n\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendProgress = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          console.log('🧹 Starting cannabis articles cleanup...');
          sendProgress({ type: 'status', message: 'Starting cleanup...' });

          // Step 1: Delete garbage articles (empty content or title)
          console.log('Step 1: Deleting garbage articles...');
          sendProgress({ type: 'status', message: 'Finding garbage articles...' });
          
          const { data: garbageArticles, error: findError } = await supabase
            .from('articles')
            .select('id, post_id, title')
            .eq('vertical_slug', 'cannabis')
            .or('content.is.null,content.eq.,title.is.null,title.eq.');

          if (findError) {
            throw new Error(`Error finding garbage articles: ${findError.message}`);
          }

          console.log(`Found ${garbageArticles?.length || 0} garbage articles to delete`);
          sendProgress({ 
            type: 'garbage_found', 
            count: garbageArticles?.length || 0,
            message: `Found ${garbageArticles?.length || 0} garbage articles` 
          });

          if (garbageArticles && garbageArticles.length > 0) {
            sendProgress({ type: 'status', message: 'Deleting garbage articles...' });
            
            const { error: deleteError } = await supabase
              .from('articles')
              .delete()
              .eq('vertical_slug', 'cannabis')
              .or('content.is.null,content.eq.,title.is.null,title.eq.');

            if (deleteError) {
              throw new Error(`Error deleting garbage articles: ${deleteError.message}`);
            }
            
            console.log(`✅ Deleted ${garbageArticles.length} garbage articles`);
            sendProgress({ 
              type: 'garbage_deleted', 
              count: garbageArticles.length,
              message: `Deleted ${garbageArticles.length} garbage articles` 
            });
          }

          // Step 2: Count total articles without headers
          console.log('Step 2: Counting articles without headers...');
          sendProgress({ type: 'status', message: 'Counting articles to reformat...' });
          
          const { count: totalCount, error: countError } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('vertical_slug', 'cannabis')
            .not('content', 'is', null)
            .not('content', 'eq', '');

          if (countError) {
            throw new Error(`Error counting articles: ${countError.message}`);
          }

          console.log(`Total cannabis articles to check: ${totalCount || 0}`);
          sendProgress({ 
            type: 'total_count', 
            total: totalCount || 0,
            message: `Processing ${totalCount || 0} articles...` 
          });

          // Process in batches of 50
          const BATCH_SIZE = 50;
          let reformattedCount = 0;
          let skippedCount = 0;
          let offset = 0;

          while (offset < (totalCount || 0)) {
            console.log(`Processing batch at offset ${offset}...`);
            
            const { data: batch, error: batchError } = await supabase
              .from('articles')
              .select('id, title, content, post_id')
              .eq('vertical_slug', 'cannabis')
              .not('content', 'is', null)
              .not('content', 'eq', '')
              .range(offset, offset + BATCH_SIZE - 1);

            if (batchError) {
              console.error(`Error fetching batch at offset ${offset}:`, batchError);
              break;
            }

            if (!batch || batch.length === 0) break;

            for (const article of batch) {
              // Check if article needs headers
              const hasHeaders = article.content?.includes('<h3>') || article.content?.includes('<h2>');
              
              if (!hasHeaders && article.content && article.content.length > 100) {
                console.log(`Reformatting article ${article.post_id}: ${article.title?.substring(0, 50)}...`);
                
                const cleanedText = cleanText(article.content);
                const formattedContent = await formatArticleWithAI(cleanedText);
                
                const { error: updateError } = await supabase
                  .from('articles')
                  .update({ 
                    content: formattedContent,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', article.id);

                if (updateError) {
                  console.error(`Error updating article ${article.id}:`, updateError);
                } else {
                  reformattedCount++;
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
              } else {
                skippedCount++;
              }
            }

            offset += BATCH_SIZE;
            console.log(`Batch complete. Progress: ${offset}/${totalCount}. Reformatted: ${reformattedCount}, Skipped: ${skippedCount}`);
            
            // Send progress update
            sendProgress({
              type: 'progress',
              processed: offset,
              total: totalCount || 0,
              reformatted: reformattedCount,
              skipped: skippedCount,
              percent: Math.round((offset / (totalCount || 1)) * 100),
              message: `Processed ${offset}/${totalCount} articles`
            });
          }

          const summary = {
            type: 'complete',
            success: true,
            deletedCount: garbageArticles?.length || 0,
            reformattedCount,
            skippedCount,
            totalProcessed: offset,
            message: `Cleanup complete: deleted ${garbageArticles?.length || 0} garbage articles, reformatted ${reformattedCount} articles without headers, skipped ${skippedCount} articles with headers`
          };

          console.log('✅ Cleanup summary:', summary);
          sendProgress(summary);
          controller.close();
        } catch (error) {
          console.error('❌ Cleanup error:', error);
          sendProgress({
            type: 'error',
            success: false,
            error: error.message
          });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

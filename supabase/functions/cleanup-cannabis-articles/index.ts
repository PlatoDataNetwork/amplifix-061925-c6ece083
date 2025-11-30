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

// Check if operation should be cancelled
async function shouldCancel(): Promise<boolean> {
  const { data, error } = await supabase
    .from('import_history')
    .select('cancelled')
    .eq('vertical_slug', 'cannabis')
    .eq('metadata->>operation', 'cleanup')
    .eq('status', 'in_progress')
    .maybeSingle();
  
  return data?.cancelled === true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json().catch(() => ({ action: 'start' }));
    
    // Handle cancel request
    if (action === 'cancel') {
      console.log('🛑 Cancellation requested');
      await supabase
        .from('import_history')
        .update({ cancelled: true, status: 'cancelled', completed_at: new Date().toISOString() })
        .eq('vertical_slug', 'cannabis')
        .eq('metadata->>operation', 'cleanup')
        .eq('status', 'in_progress');
      
      return new Response(
        JSON.stringify({ success: true, message: 'Cleanup cancelled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendProgress = (data: any) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch (e) {
            console.error('Error sending progress:', e);
          }
        };

        try {
          console.log('🧹 Starting cannabis articles cleanup...');
          
          // Create cleanup tracking record
          const { data: cleanupRecord } = await supabase
            .from('import_history')
            .insert({
              vertical_slug: 'cannabis',
              status: 'in_progress',
              metadata: { operation: 'cleanup' }
            })
            .select()
            .single();
          
          sendProgress({ type: 'status', message: 'Starting cleanup...' });

          // Step 1: Delete garbage articles (empty content or title)
          console.log('Step 1: Deleting garbage articles...');
          sendProgress({ type: 'status', message: 'Finding garbage articles...' });
          
          if (await shouldCancel()) {
            sendProgress({ type: 'cancelled', message: 'Cleanup cancelled by user' });
            controller.close();
            return;
          }
          
          const { data: garbageArticles, error: findError } = await supabase
            .from('articles')
            .select('id, post_id, title')
            .eq('vertical_slug', 'cannabis')
            .or('content.is.null,content.eq.,title.is.null,title.eq.');

          if (findError) {
            throw new Error(`Error finding garbage articles: ${findError.message}`);
          }

          const garbageCount = garbageArticles?.length || 0;
          console.log(`Found ${garbageCount} garbage articles to delete`);
          sendProgress({ type: 'garbage_found', count: garbageCount });

          if (garbageCount > 0) {
            const { error: deleteError } = await supabase
              .from('articles')
              .delete()
              .eq('vertical_slug', 'cannabis')
              .or('content.is.null,content.eq.,title.is.null,title.eq.');

            if (deleteError) {
              throw new Error(`Error deleting garbage articles: ${deleteError.message}`);
            }

            console.log(`✅ Deleted ${garbageCount} garbage articles`);
            sendProgress({ type: 'garbage_deleted', count: garbageCount });
          }

          // Step 2: Remove duplicates
          if (await shouldCancel()) {
            sendProgress({ type: 'cancelled', message: 'Cleanup cancelled by user' });
            controller.close();
            return;
          }
          
          console.log('Step 2: Finding duplicate articles...');
          sendProgress({ type: 'status', message: 'Finding duplicates...' });

          const { data: duplicates, error: dupError } = await supabase.rpc(
            'find_duplicate_cannabis_articles'
          );

          if (dupError) {
            console.log(`Error finding duplicates: ${dupError.message}, skipping...`);
          } else {
            const dupCount = duplicates?.length || 0;
            console.log(`Found ${dupCount} duplicate articles to remove`);
            sendProgress({ type: 'duplicates_found', count: dupCount });

            if (dupCount > 0) {
              for (const dup of duplicates) {
                const { error: delError } = await supabase
                  .from('articles')
                  .delete()
                  .eq('id', dup.duplicate_id);

                if (delError) {
                  console.error(`Error deleting duplicate ${dup.duplicate_id}: ${delError.message}`);
                }
              }

              console.log(`✅ Removed ${dupCount} duplicates`);
              sendProgress({ type: 'duplicates_removed', count: dupCount });
            }
          }

          // Step 3: Reformat remaining articles
          if (await shouldCancel()) {
            sendProgress({ type: 'cancelled', message: 'Cleanup cancelled by user' });
            controller.close();
            return;
          }
          
          console.log('Step 3: Reformatting articles...');
          sendProgress({ type: 'status', message: 'Loading articles to reformat...' });

          const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, post_id, title, content')
            .eq('vertical_slug', 'cannabis')
            .not('content', 'is', null)
            .not('content', 'eq', '')
            .order('published_at', { ascending: false });

          if (articlesError) {
            throw new Error(`Error loading articles: ${articlesError.message}`);
          }

          const totalArticles = articles?.length || 0;
          console.log(`Found ${totalArticles} articles to reformat`);
          sendProgress({ type: 'reformat_start', total: totalArticles });

          let reformatted = 0;
          let skipped = 0;
          const batchSize = 20;

          for (let i = 0; i < totalArticles; i += batchSize) {
            if (await shouldCancel()) {
              sendProgress({ type: 'cancelled', message: 'Cleanup cancelled by user' });
              controller.close();
              return;
            }
            
            const batch = articles.slice(i, i + batchSize);
            
            await Promise.all(
              batch.map(async (article) => {
                const cleanedText = cleanText(article.content);
                
                if (cleanedText.length < 50) {
                  skipped++;
                  return;
                }

                console.log(`Reformatting article ${article.post_id}: ${article.title.slice(0, 50)}...`);
                const formatted = await formatArticleWithAI(cleanedText);

                const { error: updateError } = await supabase
                  .from('articles')
                  .update({ content: formatted })
                  .eq('id', article.id);

                if (updateError) {
                  console.error(`Error updating article ${article.id}: ${updateError.message}`);
                  skipped++;
                } else {
                  reformatted++;
                }
              })
            );

            const progress = i + batch.length;
            console.log(`Batch complete. Progress: ${progress}/${totalArticles}. Reformatted: ${reformatted}, Skipped: ${skipped}`);
            sendProgress({
              type: 'reformat_progress',
              progress,
              total: totalArticles,
              reformatted,
              skipped
            });
          }

          // Update cleanup record
          await supabase
            .from('import_history')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString(),
              metadata: { 
                operation: 'cleanup',
                garbageDeleted: garbageCount,
                reformatted,
                skipped
              }
            })
            .eq('id', cleanupRecord?.id);

          console.log('✅ Cleanup complete!');
          sendProgress({
            type: 'complete',
            garbageDeleted: garbageCount,
            reformatted,
            skipped
          });

          controller.close();
        } catch (error) {
          console.error('❌ Cleanup error:', error);
          sendProgress({ type: 'error', message: error.message });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

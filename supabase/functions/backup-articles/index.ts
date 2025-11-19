import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Track if we're shutting down
let isShuttingDown = false;
let lastProcessedIndex = 0;

// Handle graceful shutdown
addEventListener('beforeunload', (ev) => {
  isShuttingDown = true;
  console.log(`Function shutdown initiated. Last processed index: ${lastProcessedIndex}. Reason:`, ev.detail?.reason);
});

async function backupArticles(
  supabase: any,
  backupName: string,
  backupDescription: string | null,
  userId: string | null,
  totalCount: number
) {
  let from = 0;
  const fetchSize = 500;
  const insertSize = 100;
  let totalBacked = 0;
  let hasMore = true;
  
  console.log(`Background task: Starting backup of ${totalCount} articles`);

  try {
    while (hasMore && !isShuttingDown) {
      lastProcessedIndex = from;
      
      // Fetch a batch of articles
      const { data: articles, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .range(from, from + fetchSize - 1);

      if (fetchError) {
        console.error('Error fetching articles:', fetchError);
        throw fetchError;
      }

      if (!articles || articles.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`Processing batch: ${from + 1} to ${from + articles.length}`);

      // Create backup records for this batch
      const backupRecords = articles.map(article => ({
        backup_name: backupName,
        backup_description: backupDescription || null,
        article_id: article.id,
        post_id: article.post_id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        author: article.author,
        image_url: article.image_url,
        vertical_slug: article.vertical_slug,
        published_at: article.published_at,
        metadata: article.metadata,
        created_by: userId
      }));

      // Insert backups in smaller chunks
      for (let i = 0; i < backupRecords.length && !isShuttingDown; i += insertSize) {
        const chunk = backupRecords.slice(i, i + insertSize);
        
        const { error: insertError } = await supabase
          .from('article_backups')
          .insert(chunk);

        if (insertError) {
          console.error('Error inserting backup chunk:', insertError);
          throw insertError;
        }

        totalBacked += chunk.length;
        
        // Broadcast progress update every 100 articles
        if (totalBacked % 100 === 0) {
          await supabase.channel(`backup-progress-${backupName}`).send({
            type: 'broadcast',
            event: 'progress',
            payload: { 
              backed: totalBacked, 
              total: totalCount,
              status: 'processing'
            }
          });
        }
      }

      if (totalBacked % 500 === 0) {
        console.log(`Backed up ${totalBacked} articles so far...`);
      }

      // Check if we got fewer articles than requested (end of data)
      if (articles.length < fetchSize) {
        hasMore = false;
      } else {
        from += fetchSize;
      }
    }

    if (isShuttingDown) {
      console.log(`Backup interrupted at ${totalBacked} articles due to shutdown`);
      await supabase.channel(`backup-progress-${backupName}`).send({
        type: 'broadcast',
        event: 'progress',
        payload: { 
          backed: totalBacked, 
          total: totalCount,
          status: 'interrupted'
        }
      });
    } else {
      console.log(`Backup complete: ${backupName} - ${totalBacked} articles`);
      await supabase.channel(`backup-progress-${backupName}`).send({
        type: 'broadcast',
        event: 'progress',
        payload: { 
          backed: totalBacked, 
          total: totalCount,
          status: 'completed'
        }
      });
    }

    return { success: true, totalBacked, interrupted: isShuttingDown };
  } catch (error) {
    console.error('Error in background backup task:', error);
    await supabase.channel(`backup-progress-${backupName}`).send({
      type: 'broadcast',
      event: 'progress',
      payload: { 
        backed: totalBacked, 
        total: totalCount,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { backupName, backupDescription } = await req.json();

    if (!backupName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Backup name is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Starting backup: ${backupName}`);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    console.log(`Total articles to backup: ${totalCount || 0}`);

    if (!totalCount || totalCount === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No articles found to backup',
          backedUp: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Broadcast initial progress
    await supabase.channel(`backup-progress-${backupName}`).send({
      type: 'broadcast',
      event: 'progress',
      payload: { 
        backed: 0, 
        total: totalCount,
        status: 'starting'
      }
    });

    // Start backup in background
    EdgeRuntime.waitUntil(
      backupArticles(supabase, backupName, backupDescription, userId, totalCount)
    );

    // Return immediately
    return new Response(
      JSON.stringify({
        success: true,
        message: `Backup started for ${totalCount} articles. Progress will be streamed via realtime.`,
        backupName,
        totalArticles: totalCount,
        status: 'processing'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in backup-articles:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { backupName, backupDescription, chunkIndex, chunkSize = 5000 } = await req.json();

    if (!backupName || chunkIndex === undefined) {
      return new Response(
        JSON.stringify({ success: false, error: 'Backup name and chunk index are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing chunk ${chunkIndex} for backup: ${backupName}`);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Calculate range for this chunk
    const from = chunkIndex * chunkSize;
    const to = from + chunkSize - 1;

    // Fetch articles for this chunk
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .range(from, to);

    if (fetchError) {
      console.error('Error fetching articles:', fetchError);
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No more articles to backup',
          backedUp: 0,
          hasMore: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Backing up ${articles.length} articles for chunk ${chunkIndex}`);

    // Create backup records
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

    // Insert in smaller batches to avoid memory issues
    const insertBatchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < backupRecords.length; i += insertBatchSize) {
      const batch = backupRecords.slice(i, i + insertBatchSize);
      
      const { error: insertError } = await supabase
        .from('article_backups')
        .insert(batch);

      if (insertError) {
        console.error('Error inserting backup batch:', insertError);
        throw insertError;
      }

      totalInserted += batch.length;
    }

    console.log(`Successfully backed up ${totalInserted} articles for chunk ${chunkIndex}`);

    return new Response(
      JSON.stringify({
        success: true,
        backedUp: totalInserted,
        hasMore: articles.length === chunkSize,
        chunkIndex
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in backup-articles-chunked:', error);
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

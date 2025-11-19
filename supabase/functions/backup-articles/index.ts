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

    // Fetch all articles
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('*');

    if (fetchError) {
      console.error('Error fetching articles:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${articles?.length || 0} articles to backup`);

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No articles found to backup',
          backedUp: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Insert backups in batches of 100
    const batchSize = 100;
    let totalBacked = 0;

    for (let i = 0; i < backupRecords.length; i += batchSize) {
      const batch = backupRecords.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('article_backups')
        .insert(batch);

      if (insertError) {
        console.error('Error inserting backup batch:', insertError);
        throw insertError;
      }

      totalBacked += batch.length;
      console.log(`Backed up ${totalBacked}/${backupRecords.length} articles`);
    }

    console.log(`Backup complete: ${backupName} - ${totalBacked} articles`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully backed up ${totalBacked} articles`,
        backupName,
        totalArticles: totalBacked
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

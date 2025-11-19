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
    const { backupName } = await req.json();

    if (!backupName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Backup name is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Starting restore from backup: ${backupName}`);

    // Fetch backup records
    const { data: backups, error: fetchError } = await supabase
      .from('article_backups')
      .select('*')
      .eq('backup_name', backupName);

    if (fetchError) {
      console.error('Error fetching backups:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${backups?.length || 0} backup records to restore`);

    if (!backups || backups.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No backup found with that name'
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Restore articles
    let restored = 0;
    let errors = 0;
    const errorDetails: Array<{ article_id: string; error: string }> = [];

    for (const backup of backups) {
      try {
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: backup.title,
            content: backup.content,
            excerpt: backup.excerpt,
            author: backup.author,
            image_url: backup.image_url,
            vertical_slug: backup.vertical_slug,
            published_at: backup.published_at,
            metadata: backup.metadata,
            updated_at: new Date().toISOString()
          })
          .eq('id', backup.article_id);

        if (updateError) {
          console.error(`Error restoring article ${backup.article_id}:`, updateError);
          errors++;
          errorDetails.push({
            article_id: backup.article_id,
            error: updateError.message
          });
        } else {
          restored++;
          console.log(`✓ Restored article ${backup.post_id}: ${backup.title}`);
        }
      } catch (err) {
        console.error(`Error processing backup for article ${backup.article_id}:`, err);
        errors++;
        errorDetails.push({
          article_id: backup.article_id,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    console.log(`Restore complete. Restored: ${restored}, Errors: ${errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Restore complete from backup: ${backupName}`,
        total: backups.length,
        restored,
        errors,
        errorDetails: errors > 0 ? errorDetails : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in restore-articles:', error);
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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { keepBackupName } = await req.json();

    if (!keepBackupName) {
      return new Response(
        JSON.stringify({ success: false, error: 'keepBackupName is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Deleting all backups except: ${keepBackupName}`);

    // Get count before deletion
    const { count: beforeCount } = await supabase
      .from('article_backups')
      .select('*', { count: 'exact', head: true });

    const { count: keepCount } = await supabase
      .from('article_backups')
      .select('*', { count: 'exact', head: true })
      .eq('backup_name', keepBackupName);

    console.log(`Total records before: ${beforeCount}`);
    console.log(`Records to keep: ${keepCount}`);
    console.log(`Records to delete: ${(beforeCount || 0) - (keepCount || 0)}`);

    // Delete backup jobs first (foreign key consideration)
    const { error: jobsError } = await supabase
      .from('backup_jobs')
      .delete()
      .neq('backup_name', keepBackupName);

    if (jobsError) {
      console.error('Error deleting backup jobs:', jobsError);
    }

    // Delete article backups in batches to avoid timeouts
    const batchSize = 1000;
    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
      // Delete batch
      const { data: deletedBatch, error: deleteError } = await supabase
        .from('article_backups')
        .delete()
        .neq('backup_name', keepBackupName)
        .limit(batchSize)
        .select('id');

      if (deleteError) {
        console.error('Error deleting backup batch:', deleteError);
        throw deleteError;
      }

      if (!deletedBatch || deletedBatch.length === 0) {
        hasMore = false;
      } else {
        totalDeleted += deletedBatch.length;
        console.log(`Deleted ${totalDeleted} records so far...`);
        
        if (deletedBatch.length < batchSize) {
          hasMore = false;
        }
      }
    }

    // Get final count
    const { count: afterCount } = await supabase
      .from('article_backups')
      .select('*', { count: 'exact', head: true });

    console.log(`Deletion complete. Total deleted: ${totalDeleted}`);
    console.log(`Remaining records: ${afterCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: totalDeleted,
        remainingCount: afterCount,
        keptBackup: keepBackupName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in delete-backups-except:', error);
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
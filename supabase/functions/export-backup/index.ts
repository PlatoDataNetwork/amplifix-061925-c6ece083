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

    const { backupName } = await req.json();

    if (!backupName) {
      return new Response(
        JSON.stringify({ success: false, error: 'backupName is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Exporting backup: ${backupName}`);

    // Get total count first
    const { count } = await supabase
      .from('article_backups')
      .select('*', { count: 'exact', head: true })
      .eq('backup_name', backupName);

    if (!count || count === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No backup found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Total records to export: ${count}`);

    // Fetch all records in batches
    const batchSize = 1000;
    const allRecords = [];
    
    for (let i = 0; i < count; i += batchSize) {
      console.log(`Fetching batch: ${i} to ${i + batchSize - 1}`);
      
      const { data: batch, error } = await supabase
        .from('article_backups')
        .select('*')
        .eq('backup_name', backupName)
        .order('created_at', { ascending: true })
        .range(i, i + batchSize - 1);

      if (error) {
        console.error('Error fetching batch:', error);
        throw error;
      }

      if (batch) {
        allRecords.push(...batch);
        console.log(`Fetched ${allRecords.length} records so far`);
      }
    }

    console.log(`Total records fetched: ${allRecords.length}`);

    // Create export object
    const exportData = {
      backup_name: backupName,
      backup_description: allRecords[0]?.backup_description,
      exported_at: new Date().toISOString(),
      total_articles: allRecords.length,
      articles: allRecords.map(record => ({
        article_id: record.article_id,
        post_id: record.post_id,
        title: record.title,
        content: record.content,
        excerpt: record.excerpt,
        author: record.author,
        image_url: record.image_url,
        vertical_slug: record.vertical_slug,
        published_at: record.published_at,
        metadata: record.metadata
      }))
    };

    console.log(`Export complete. Sending response...`);

    return new Response(
      JSON.stringify(exportData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${backupName}.json"`
        } 
      }
    );

  } catch (error) {
    console.error('Fatal error in export-backup:', error);
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

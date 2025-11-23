import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { dryRun = true, verticalSlug = null } = await req.json().catch(() => ({ dryRun: true, verticalSlug: null }));

    const scope = verticalSlug ? `vertical "${verticalSlug}"` : 'ALL VERTICALS';
    console.log(`🧹 Starting duplicate cleanup for ${scope} (dry run: ${dryRun})`);

    // Step 1: Fetch ALL articles using cursor-based pagination
    let allArticles: Array<{ id: string; title: string; created_at: string; vertical_slug: string }> = [];
    let hasMore = true;
    let offset = 0;
    const batchSize = 1000;

    console.log(`📡 Starting to fetch articles for ${scope}...`);

    while (hasMore) {
      let query = supabaseClient
        .from('articles')
        .select('id, title, created_at, vertical_slug', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + batchSize - 1);
      
      // Filter by vertical if specified
      if (verticalSlug) {
        query = query.eq('vertical_slug', verticalSlug);
      }
      
      const { data: batch, error: fetchError, count } = await query;

      if (fetchError) {
        console.error('Error fetching articles:', fetchError);
        throw fetchError;
      }

      if (batch && batch.length > 0) {
        allArticles = allArticles.concat(batch);
        console.log(`📄 Batch ${Math.floor(offset / batchSize) + 1}: fetched ${batch.length} articles (total so far: ${allArticles.length})`);
        
        // Check if we've fetched everything
        if (count !== null) {
          console.log(`📊 Database reports ${count} total articles`);
          hasMore = allArticles.length < count;
        } else {
          hasMore = batch.length === batchSize;
        }
        
        offset += batchSize;
      } else {
        hasMore = false;
      }

      // No safety limit - process all articles based on database count
      if (count !== null && allArticles.length >= count) {
        hasMore = false;
      }
    }

    console.log(`✅ Fetched ${allArticles.length} total articles for ${scope}`);

    // Step 2: Group by title to find duplicates (regardless of vertical)
    const titleGroups = new Map<string, Array<{ id: string; created_at: string; vertical_slug: string }>>();
    
    for (const article of allArticles) {
      if (!titleGroups.has(article.title)) {
        titleGroups.set(article.title, []);
      }
      titleGroups.get(article.title)!.push({
        id: article.id,
        created_at: article.created_at,
        vertical_slug: article.vertical_slug
      });
    }

    // Step 3: Identify duplicates (titles with more than 1 article)
    const duplicateTitles = Array.from(titleGroups.entries())
      .filter(([_, articles]) => articles.length > 1);

    console.log(`📊 Found ${duplicateTitles.length} titles with duplicates`);
    console.log(`📊 Total duplicate articles to remove: ${duplicateTitles.reduce((sum, [_, articles]) => sum + articles.length - 1, 0)}`);

    let totalDuplicates = 0;
    let deletedCount = 0;
    const deletionDetails: Array<{
      title: string;
      kept: string;
      deleted: number;
      verticals: string[];
    }> = [];

    // For each duplicate title group
    for (const [title, articles] of duplicateTitles) {
      // Sort by created_at DESC to keep the most recent
      const sorted = articles.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const keepId = sorted[0].id; // Keep the most recent
      const deleteIds = sorted.slice(1).map(a => a.id); // Delete all others
      const affectedVerticals = Array.from(new Set(articles.map(a => a.vertical_slug)));
      
      totalDuplicates += deleteIds.length;

      deletionDetails.push({
        title: title.substring(0, 100), // Truncate long titles
        kept: keepId,
        deleted: deleteIds.length,
        verticals: affectedVerticals
      });

      if (!dryRun && deleteIds.length > 0) {
        // Delete the duplicates in batches of 100
        for (let i = 0; i < deleteIds.length; i += 100) {
          const batch = deleteIds.slice(i, i + 100);
          
          const { error: deleteError } = await supabaseClient
            .from('articles')
            .delete()
            .in('id', batch);

          if (deleteError) {
            console.error(`Error deleting batch for "${title}":`, deleteError);
          } else {
            deletedCount += batch.length;
            console.log(`✓ Deleted ${batch.length} duplicates for "${title}"`);
          }
        }
      }
    }

    const summary = {
      success: true,
      dryRun,
      duplicateTitles: duplicateTitles.length,
      totalDuplicateArticles: totalDuplicates,
      deletedCount: dryRun ? 0 : deletedCount,
      message: dryRun 
        ? `Would delete ${totalDuplicates} duplicate articles (keeping most recent for each title)`
        : `Deleted ${deletedCount} duplicate articles`,
      details: deletionDetails.slice(0, 20), // Return first 20 for inspection
    };

    console.log('\n📊 Summary:', summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cleanup function:', error);
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

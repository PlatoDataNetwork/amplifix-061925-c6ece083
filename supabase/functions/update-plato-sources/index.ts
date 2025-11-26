import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerticalStats {
  vertical: string;
  total: number;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
  status: 'pending' | 'processing' | 'completed';
}

interface UpdateStats {
  totalArticles: number;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
  verticals: VerticalStats[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin access
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: hasRole } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!hasRole) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get vertical parameter from request body (if processing single vertical)
    const body = await req.json().catch(() => ({}));
    const targetVertical = body.vertical || null;

    console.log(targetVertical 
      ? `🔄 Starting Plato source update for vertical: ${targetVertical}` 
      : '🔄 Starting Plato source update process for all verticals...');

    // Fetch ALL articles excluding aerospace and aviation (fetch in batches to avoid limits)
    let allArticles: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      let query = supabase
        .from('articles')
        .select('id, content, vertical_slug')
        .not('vertical_slug', 'in', '("aerospace","aviation")')
        .order('vertical_slug');
      
      // If processing single vertical, filter by it
      if (targetVertical) {
        query = query.eq('vertical_slug', targetVertical);
      }
      
      const { data: batch, error: fetchError } = await query.range(from, from + batchSize - 1);

      if (fetchError) {
        console.error('Error fetching articles:', fetchError);
        throw fetchError;
      }

      if (batch && batch.length > 0) {
        allArticles = allArticles.concat(batch);
        console.log(`📦 Fetched batch: ${batch.length} articles (total so far: ${allArticles.length})`);
        from += batchSize;
        hasMore = batch.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    const articles = allArticles;
    console.log(`📊 Total articles to process: ${articles.length}`);

    // Group articles by vertical
    const verticalGroups = new Map<string, typeof articles>();
    articles.forEach(article => {
      const vertical = article.vertical_slug;
      if (!verticalGroups.has(vertical)) {
        verticalGroups.set(vertical, []);
      }
      verticalGroups.get(vertical)!.push(article);
    });

    console.log(`📁 Processing ${verticalGroups.size} verticals`);

    const verticalStats: VerticalStats[] = Array.from(verticalGroups.keys()).map(vertical => ({
      vertical,
      total: verticalGroups.get(vertical)!.length,
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      status: 'pending' as const,
    }));

    const stats: UpdateStats = {
      totalArticles: articles.length,
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      verticals: verticalStats,
    };

    const BATCH_SIZE = 20;
    
    // Process each vertical separately
    for (const [verticalSlug, verticalArticles] of verticalGroups) {
      const vStats = verticalStats.find(v => v.vertical === verticalSlug)!;
      vStats.status = 'processing';
      console.log(`\n🔄 Processing vertical: ${verticalSlug} (${verticalArticles.length} articles)`);

      for (let i = 0; i < verticalArticles.length; i += BATCH_SIZE) {
        const batch = verticalArticles.slice(i, i + BATCH_SIZE);
        
        for (const article of batch) {
          try {
            if (!article.content) {
              vStats.skipped++;
              vStats.processed++;
              stats.skipped++;
              stats.processed++;
              continue;
            }

            // Skip if already has correct format (plain text, no link)
            if (/Source:\s*Plato Data Intelligence\.\s*$/mi.test(article.content) && 
                !/<a[^>]*>.*?Plato Data Intelligence.*?<\/a>/i.test(article.content) &&
                !/Zephyrnet/i.test(article.content) &&
                !/Plato AI/i.test(article.content)) {
              vStats.skipped++;
              vStats.processed++;
              stats.skipped++;
              stats.processed++;
              continue;
            }

            // Replace various source patterns with the new format
            let updatedContent = article.content;
            let needsUpdate = false;

            // Pattern 1: Source: <a href="...">Plato Data Intelligence</a>
            const pattern1 = /Source:\s*<a\s+[^>]*href=["'][^"']*["'][^>]*>Plato Data Intelligence[^<]*<\/a>/gi;
            if (pattern1.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern1, 'Source: Plato Data Intelligence.');
              needsUpdate = true;
            }

            // Pattern 2: Source: Plato Data Intelligence: <a href="...">...</a>
            const pattern2 = /Source:\s*Plato Data Intelligence:\s*<a\s+[^>]*href=["'][^"']*["'][^>]*>[^<]*<\/a>/gi;
            if (pattern2.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern2, 'Source: Plato Data Intelligence.');
              needsUpdate = true;
            }

            // Pattern 3: Any remaining Plato links
            const pattern3 = /<a\s+[^>]*href=["']https?:\/\/[^"']*plato[^"']*["'][^>]*>Plato Data Intelligence[^<]*<\/a>/gi;
            if (pattern3.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern3, 'Plato Data Intelligence');
              needsUpdate = true;
            }

            // Pattern 4: Remove Zephyrnet references
            const pattern4 = /Source:\s*<a\s+[^>]*href=["'][^"']*["'][^>]*>Zephyrnet[^<]*<\/a>/gi;
            if (pattern4.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern4, 'Source: Plato Data Intelligence.');
              needsUpdate = true;
            }

            // Pattern 5: Remove Zephyrnet plain text
            const pattern5 = /Source:\s*Zephyrnet\s*\.?/gi;
            if (pattern5.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern5, 'Source: Plato Data Intelligence.');
              needsUpdate = true;
            }

            // Pattern 6: Remove Plato AI references
            const pattern6 = /Source:\s*<a\s+[^>]*href=["'][^"']*["'][^>]*>Plato AI[^<]*<\/a>/gi;
            if (pattern6.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern6, 'Source: Plato Data Intelligence.');
              needsUpdate = true;
            }

            // Pattern 7: Remove Plato AI plain text
            const pattern7 = /Source:\s*Plato AI\s*\.?/gi;
            if (pattern7.test(updatedContent)) {
              updatedContent = updatedContent.replace(pattern7, 'Source: Plato Data Intelligence.');
              needsUpdate = true;
            }

            if (needsUpdate) {
              const { error: updateError } = await supabase
                .from('articles')
                .update({ content: updatedContent })
                .eq('id', article.id);

              if (updateError) {
                console.error(`Error updating article ${article.id}:`, updateError);
                vStats.errors++;
                stats.errors++;
              } else {
                vStats.updated++;
                stats.updated++;
              }
            } else {
              vStats.skipped++;
              stats.skipped++;
            }

            vStats.processed++;
            stats.processed++;
          } catch (error) {
            console.error(`Error processing article ${article.id}:`, error);
            vStats.errors++;
            vStats.processed++;
            stats.errors++;
            stats.processed++;
          }
        }

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      vStats.status = 'completed';
      console.log(`✅ Completed ${verticalSlug}: ${vStats.updated} updated, ${vStats.skipped} skipped, ${vStats.errors} errors`);
    }

    console.log('\n✅ All verticals complete:', stats);

    return new Response(JSON.stringify({
      success: true,
      message: 'Source update completed',
      stats,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in update-plato-sources:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

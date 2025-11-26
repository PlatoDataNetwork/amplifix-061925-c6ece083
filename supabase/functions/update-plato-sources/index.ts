import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateStats {
  totalArticles: number;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
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

    console.log('🔄 Starting Plato source update process...');

    // Fetch all articles excluding aerospace and aviation
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, content, vertical_slug')
      .not('vertical_slug', 'in', '("aerospace","aviation")');

    if (fetchError) {
      console.error('Error fetching articles:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${articles.length} articles to process`);

    const stats: UpdateStats = {
      totalArticles: articles.length,
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    const BATCH_SIZE = 50;
    
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);
      
      for (const article of batch) {
        try {
          if (!article.content) {
            stats.skipped++;
            stats.processed++;
            continue;
          }

          // Replace various source patterns with the new format
          let updatedContent = article.content;
          let needsUpdate = false;

          // Pattern 1: Source: <a href="...">Plato Data Intelligence</a>
          const pattern1 = /Source:\s*<a\s+[^>]*href=["'][^"']*["'][^>]*>Plato Data Intelligence(?:\.|<\/a>)/gi;
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

          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from('articles')
              .update({ content: updatedContent })
              .eq('id', article.id);

            if (updateError) {
              console.error(`Error updating article ${article.id}:`, updateError);
              stats.errors++;
            } else {
              stats.updated++;
              console.log(`✓ Updated article ${article.id} (${article.vertical_slug})`);
            }
          } else {
            stats.skipped++;
          }

          stats.processed++;
        } catch (error) {
          console.error(`Error processing article ${article.id}:`, error);
          stats.errors++;
          stats.processed++;
        }
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Update complete:', stats);

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { jsonUrl } = await req.json();
    
    if (!jsonUrl) {
      throw new Error('JSON URL is required');
    }

    console.log('Starting cyber-security fast import from:', jsonUrl);

    const { data: feedData, error: fetchError } = await supabaseClient.functions.invoke('fetch-cyber-security-feed', {
      body: { jsonUrl }
    });

    if (fetchError) throw fetchError;

    // Handle different JSON structures
    let articles = [];
    if (Array.isArray(feedData)) {
      articles = feedData;
    } else if (feedData.posts && Array.isArray(feedData.posts)) {
      articles = feedData.posts;
    } else if (feedData.articles && Array.isArray(feedData.articles)) {
      articles = feedData.articles;
    }
    
    console.log(`Fetched ${articles.length} cyber-security articles`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    const batchSize = 50;
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      for (const article of batch) {
        try {
          const { data: existing } = await supabaseClient
            .from('articles')
            .select('id')
            .eq('title', article.title)
            .eq('vertical_slug', 'cyber-security')
            .maybeSingle();

          if (existing) {
            skipped++;
            continue;
          }

          const { error: insertError } = await supabaseClient
            .from('articles')
            .insert({
              title: article.title,
              content: article.content,
              excerpt: article.excerpt,
              author: article.author,
              published_at: article.published_at,
              image_url: article.image_url,
              external_url: article.external_url,
              vertical_slug: 'cyber-security',
              metadata: {
                source: article.source || 'cyber-security-feed',
                original_url: article.external_url
              }
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            errors++;
          } else {
            imported++;
          }
        } catch (error) {
          console.error('Error processing article:', error);
          errors++;
        }
      }

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}: ${imported} imported, ${skipped} skipped, ${errors} errors`);
    }

    const message = `Cyber-security import complete: ${imported} imported, ${skipped} skipped, ${errors} errors`;
    console.log(message);

    return new Response(JSON.stringify({ 
      success: true,
      message,
      imported,
      skipped,
      errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in cyber-security fast import:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

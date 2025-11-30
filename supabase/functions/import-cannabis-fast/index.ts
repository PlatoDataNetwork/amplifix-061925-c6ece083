import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CannabisFeedArticle {
  id?: number;
  post_id?: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  published_at?: string;
  author?: string;
  source?: string;
  categories?: string[];
  image_url?: string;
  external_url?: string;
}

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

    console.log('Starting cannabis fast import from:', jsonUrl);

    const response = await fetch(jsonUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch cannabis feed: ${response.status} ${response.statusText}`);
    }

    const feedData = await response.json();

    // Handle different JSON structures (array or wrapped object)
    let articles: CannabisFeedArticle[] = [];
    if (Array.isArray(feedData)) {
      articles = feedData as CannabisFeedArticle[];
    } else if (Array.isArray(feedData.articles)) {
      articles = feedData.articles as CannabisFeedArticle[];
    } else if (Array.isArray(feedData.posts)) {
      articles = feedData.posts as CannabisFeedArticle[];
    }

    console.log(`Fetched ${articles.length} cannabis articles from feed`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;
    let importHistoryId: string | null = null;

    const batchSize = 50;

    const totalFromFeed = articles.length;

    if (totalFromFeed > 0) {
      const { data: historyRow, error: historyError } = await supabaseClient
        .from('import_history')
        .insert({
          vertical_slug: 'cannabis',
          status: 'in_progress',
          imported_count: 0,
          skipped_count: 0,
          error_count: 0,
          total_processed: 0,
          metadata: {
            json_url: jsonUrl,
            total_from_feed: totalFromFeed,
          },
        })
        .select('id')
        .single();

      if (historyError) {
        console.error('Error creating cannabis import history:', historyError);
      } else {
        importHistoryId = historyRow?.id ?? null;
      }
    }

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);

      for (const raw of batch) {
        try {
          const title = raw.title?.trim();
          if (!title) {
            skipped++;
            continue;
          }

          // Check if article already exists (by title + vertical)
          const { data: existing, error: existingError } = await supabaseClient
            .from('articles')
            .select('id')
            .eq('title', title)
            .eq('vertical_slug', 'cannabis')
            .maybeSingle();

          if (existingError) {
            console.error('Error checking existing article:', existingError);
          }

          if (existing) {
            skipped++;
            continue;
          }

          const content = raw.content ?? '';

          // Derive excerpt if not provided
          const plainContent = content.replace(/<[^>]*>/g, '');
          const excerpt = raw.excerpt || plainContent.substring(0, 300).trim() || null;

          // Map date field
          const publishedRaw = raw.published_at || raw.date;
          const published_at = publishedRaw
            ? new Date(publishedRaw).toISOString()
            : new Date().toISOString();

          // Map external URL from "source" when present
          const external_url = raw.external_url || raw.source || null;

          const { error: insertError } = await supabaseClient
            .from('articles')
            .insert({
              title,
              content,
              excerpt,
              author: raw.author || 'Republished By Plato',
              published_at,
              image_url: raw.image_url || null,
              external_url,
              vertical_slug: 'cannabis',
              metadata: {
                source: raw.source || 'cannabis-feed',
                original_url: external_url,
                original_id: raw.post_id || raw.id,
                slug: raw.slug,
                categories: raw.categories || [],
              },
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            errors++;
          } else {
            imported++;
          }
        } catch (error) {
          console.error('Error processing cannabis article:', error);
          errors++;
        }
      }

      if (importHistoryId) {
        const totalProcessed = imported + skipped + errors;
        const { error: updateError } = await supabaseClient
          .from('import_history')
          .update({
            imported_count: imported,
            skipped_count: skipped,
            error_count: errors,
            total_processed: totalProcessed,
            status: 'in_progress',
            updated_at: new Date().toISOString(),
          })
          .eq('id', importHistoryId);

        if (updateError) {
          console.error('Error updating cannabis import history:', updateError);
        }
      }

      console.log(
        `Processed cannabis batch ${Math.floor(i / batchSize) + 1}: ${imported} imported, ${skipped} skipped, ${errors} errors`,
      );
    }

    if (importHistoryId) {
      const totalProcessed = imported + skipped + errors;
      const { error: finalizeError } = await supabaseClient
        .from('import_history')
        .update({
          imported_count: imported,
          skipped_count: skipped,
          error_count: errors,
          total_processed: totalProcessed,
          status: 'completed',
          completed_at: new Date().toISOString(),
          cancelled: false,
        })
        .eq('id', importHistoryId);

      if (finalizeError) {
        console.error('Error finalizing cannabis import history:', finalizeError);
      }
    }

    const message = `Cannabis import complete: ${imported} imported, ${skipped} skipped, ${errors} errors`;
    console.log(message);

    return new Response(
      JSON.stringify({
        success: true,
        message,
        imported,
        skipped,
        errors,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error in cannabis fast import:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error in cannabis fast import' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

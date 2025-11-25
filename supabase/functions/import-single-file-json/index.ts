import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Article {
  post_id?: number;
  title: string;
  content?: string;
  excerpt?: string;
  date?: string;
  slug: string;
  metadata?: {
    sourceLink?: string[];
    featuredImage?: string[];
    [key: string]: any;
  };
}

interface JsonStructure {
  id?: number;
  name?: string;
  slug?: string;
  articles: Article[];
}

// Simple text cleaning
function cleanText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/<\/?(p|div|span|strong|em|ul|ol|li|h[1-6])[^>]*>/gi, "")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Background import function - processes all articles from single JSON file
async function runBackgroundImport(
  supabaseClient: any,
  historyId: string,
  userId: string,
  jsonUrl: string,
  verticalSlug: string
) {
  const startTime = Date.now();
  console.log(`🚀 Single-file JSON import started for ${verticalSlug} from ${jsonUrl}`);

  const progressChannel = supabaseClient.channel(`${verticalSlug}-single-${userId}`, {
    config: { broadcast: { self: true } }
  });
  
  await progressChannel.subscribe();

  const broadcastProgress = async (update: any) => {
    try {
      await progressChannel.send({
        type: 'broadcast',
        event: 'import-progress',
        payload: update
      });
    } catch (err) {
      console.error('Broadcast error:', err);
    }
  };

  const results = {
    totalInFeed: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
    duration: 0
  };

  try {
    await broadcastProgress({
      phase: 'fetching',
      currentPage: 0,
      totalPages: 1,
      articlesCollected: 0,
      imported: 0,
      skipped: 0,
      message: `Fetching ${verticalSlug} data from single JSON file...`
    });

    console.log(`📥 Fetching JSON from ${jsonUrl}...`);
    const response = await fetch(jsonUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    }

    const jsonData: JsonStructure = await response.json();
    
    // Extract articles array
    let articles: Article[] = [];
    if (Array.isArray(jsonData)) {
      articles = jsonData;
    } else if (jsonData.articles && Array.isArray(jsonData.articles)) {
      articles = jsonData.articles;
    } else {
      throw new Error('Invalid JSON structure: expected articles array');
    }

    results.totalInFeed = articles.length;
    console.log(`✓ Found ${articles.length} articles in JSON file`);

    await broadcastProgress({
      phase: 'processing',
      currentPage: 0,
      totalPages: 1,
      articlesCollected: articles.length,
      imported: 0,
      skipped: 0,
      message: `Processing ${articles.length} articles...`
    });

    // Process articles in batches of 50
    const batchSize = 50;
    const totalBatches = Math.ceil(articles.length / batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, articles.length);
      const batchArticles = articles.slice(batchStart, batchEnd);

      console.log(`\n📦 Processing batch ${batchIndex + 1}/${totalBatches} (${batchArticles.length} articles)`);

      for (const article of batchArticles) {
        try {
          const postId = article.post_id;
          
          if (!postId) {
            results.errors++;
            continue;
          }

          // Check if exists
          const { data: existingArticle } = await supabaseClient
            .from('articles')
            .select('id, post_id')
            .eq('post_id', postId)
            .maybeSingle();

          if (existingArticle) {
            results.skipped++;
            continue;
          }

          // Extract title
          const title = typeof article.title === 'string' 
            ? article.title 
            : article.title || '';
          
          // Extract content and excerpt
          const rawContent = typeof article.content === 'string'
            ? article.content
            : article.content || '';

          // Clean content (NO AI)
          const cleanedText = cleanText(rawContent);
          const excerpt = cleanedText.substring(0, 300);

          // Do not import source links per user request
          const externalUrl = null;

          const articleData = {
            post_id: postId,
            title: title,
            content: cleanedText,
            excerpt: excerpt,
            published_at: article.date || new Date().toISOString(),
            vertical_slug: verticalSlug,
            author: 'PlatoData',
            read_time: '3 Min Read',
            image_url: article.metadata?.featuredImage?.[0] || null,
            external_url: externalUrl,
            metadata: article.metadata || {},
          };

          const { error: insertError } = await supabaseClient
            .from('articles')
            .insert(articleData);

          if (insertError) {
            console.error(`Error inserting article ${postId}:`, insertError);
            results.errors++;
            continue;
          }

          results.imported++;

        } catch (err) {
          console.error(`Error processing article:`, err);
          results.errors++;
        }
      }

      // Update progress after each batch
      await supabaseClient
        .from('import_history')
        .update({
          imported_count: results.imported,
          skipped_count: results.skipped,
          error_count: results.errors,
          total_processed: batchEnd,
          metadata: {
            totalInFeed: results.totalInFeed,
            currentBatch: batchIndex + 1,
            totalBatches: totalBatches,
            note: 'Single-file JSON import (in progress)'
          }
        })
        .eq('id', historyId);

      await broadcastProgress({
        phase: 'processing',
        currentPage: batchIndex + 1,
        totalPages: totalBatches,
        articlesCollected: results.totalInFeed,
        imported: results.imported,
        skipped: results.skipped,
        errors: results.errors,
        percentComplete: Math.round((batchEnd / articles.length) * 100),
        message: `Batch ${batchIndex + 1}/${totalBatches}: ${results.imported} imported, ${results.skipped} skipped`
      });

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    results.duration = Date.now() - startTime;

    // Final history update
    await supabaseClient
      .from('import_history')
      .update({
        imported_count: results.imported,
        skipped_count: results.skipped,
        error_count: results.errors,
        total_processed: results.totalInFeed,
        duration_ms: results.duration,
        completed_at: new Date().toISOString(),
        status: results.errors > 0 ? 'partial' : 'completed',
        metadata: {
          totalInFeed: results.totalInFeed,
          jsonUrl: jsonUrl,
          note: 'Single-file JSON import completed'
        }
      })
      .eq('id', historyId);

    await broadcastProgress({
      phase: 'complete',
      currentPage: totalBatches,
      totalPages: totalBatches,
      articlesCollected: results.totalInFeed,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
      percentComplete: 100,
      message: 'Import complete!'
    });

    console.log('\n✅ Single-file JSON import completed:', results);

  } catch (error) {
    console.error('Background import error:', error);
    
    // Update history with error
    await supabaseClient
      .from('import_history')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        metadata: {
          error: error.message,
          note: 'Import failed'
        }
      })
      .eq('id', historyId);

    await broadcastProgress({
      phase: 'error',
      message: `Import failed: ${error.message}`,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors
    });
  } finally {
    await supabaseClient.removeChannel(progressChannel);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const body = await req.json().catch(() => ({}));
  const jsonUrl = body.jsonUrl;
  const verticalSlug = body.verticalSlug || 'aviation';
  
  if (!jsonUrl) {
    return new Response(
      JSON.stringify({ success: false, error: 'jsonUrl is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  console.log(`📥 Single-file JSON import request - Vertical: ${verticalSlug}, URL: ${jsonUrl}`);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } },
      }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: hasAdminRole, error: roleError } = await supabaseAuth
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create new import history
    console.log(`Admin ${user.email} starting new single-file JSON import for ${verticalSlug}`);
    
    const { data: historyRecord } = await supabaseClient
      .from('import_history')
      .insert({
        vertical_slug: verticalSlug,
        status: 'in_progress',
        imported_by: user.id,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    const historyId = historyRecord?.id;

    if (!historyId) {
      throw new Error('Failed to create import history record');
    }

    // Start background import using waitUntil
    const ctx = Deno.env.get('DENO_REGION') ? (globalThis as any).EdgeRuntime : null;
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(runBackgroundImport(supabaseClient, historyId, user.id, jsonUrl, verticalSlug));
    } else {
      // Fallback for local development
      runBackgroundImport(supabaseClient, historyId, user.id, jsonUrl, verticalSlug).catch(console.error);
    }

    // Return immediately
    return new Response(
      JSON.stringify({
        success: true,
        message: `${verticalSlug} import from single JSON file started in background.`,
        historyId: historyId,
        vertical: verticalSlug,
        jsonUrl: jsonUrl
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

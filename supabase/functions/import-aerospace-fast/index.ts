import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AerospaceArticle {
  id?: number;
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

// Background import function - processes in chunks
async function runBackgroundImport(
  supabaseClient: any,
  historyId: string,
  userId: string,
  startPage: number = 1,
  maxPages: number = 50 // Process 50 pages per run
) {
  const startTime = Date.now();
  console.log(`🚀 Background import started from page ${startPage}, max ${maxPages} pages`);

  const progressChannel = supabaseClient.channel(`aerospace-fast-${userId}`, {
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
    totalPages: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
    duration: 0
  };

  let currentPage = startPage;
  let hasMorePages = true;
  const endPage = startPage + maxPages - 1;

  console.log(`🔄 Starting FAST import from page ${startPage} to ${endPage}`);

  await broadcastProgress({
    phase: 'processing',
    currentPage: 0,
    totalPages: 0,
    articlesCollected: 0,
    imported: 0,
    skipped: 0,
    message: 'Starting fast import in background...'
  });

  try {
    while (hasMorePages && currentPage <= endPage) {
      console.log(`\n📄 Fetching page ${currentPage} (${currentPage - startPage + 1}/${maxPages})...`);
      
      const pageUrl = `https://platodata.ai/aerospace/json/?page=${currentPage}`;
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        console.error(`Failed to fetch page ${currentPage}: ${response.statusText}`);
        break;
      }

      const articlesData = await response.json();
      
      let pageArticles: AerospaceArticle[] = [];
      if (Array.isArray(articlesData)) {
        pageArticles = articlesData;
      } else if (articlesData.posts && Array.isArray(articlesData.posts)) {
        pageArticles = articlesData.posts;
      } else if (articlesData.articles && Array.isArray(articlesData.articles)) {
        pageArticles = articlesData.articles;
      } else if (typeof articlesData === 'object' && articlesData !== null) {
        const values = Object.values(articlesData);
        if (values.length > 0 && typeof values[0] === 'object') {
          pageArticles = values as AerospaceArticle[];
        }
      }

      console.log(`✓ Page ${currentPage}: Found ${pageArticles.length} articles`);

      if (pageArticles.length === 0) {
        console.log(`\n🏁 Reached last page (page ${currentPage} has 0 articles)`);
        hasMorePages = false;
        break;
      }

      results.totalPages = currentPage;
      results.totalInFeed += pageArticles.length;

      // Process articles from this page (NO AI)
      for (const article of pageArticles) {
        try {
          const postId = article.post_id || article.id;
          
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

          // Simple content cleaning (NO AI)
          const rawContent = article.content || article.excerpt || '';
          const cleanedText = cleanText(rawContent);
          const excerpt = article.excerpt || cleanedText.substring(0, 300);

          const articleData = {
            post_id: postId,
            title: article.title,
            content: cleanedText,
            excerpt: excerpt,
            published_at: article.date || new Date().toISOString(),
            vertical_slug: 'aerospace',
            author: 'PlatoData',
            read_time: '3 Min Read',
            image_url: article.metadata?.featuredImage?.[0] || null,
            external_url: article.metadata?.sourceLink?.[0] || null,
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

      // Update history every 10 pages
      if (currentPage % 10 === 0) {
        await supabaseClient
          .from('import_history')
          .update({
            imported_count: results.imported,
            skipped_count: results.skipped,
            error_count: results.errors,
            total_processed: results.totalInFeed,
            metadata: {
              totalPages: results.totalPages,
              currentPage: currentPage,
              totalInFeed: results.totalInFeed,
              note: 'Fast import without AI processing (in progress)'
            }
          })
          .eq('id', historyId);

        await broadcastProgress({
          phase: 'processing',
          currentPage: currentPage,
          totalPages: currentPage,
          articlesCollected: results.totalInFeed,
          imported: results.imported,
          skipped: results.skipped,
          errors: results.errors,
          message: `Page ${currentPage}: ${results.imported} imported, ${results.skipped} skipped`
        });
      }

      console.log(`✅ Page ${currentPage} complete: ${results.imported} total imported`);

      currentPage++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    results.duration = Date.now() - startTime;
    
    const hasMore = hasMorePages && currentPage <= endPage;
    const finalStatus = hasMore ? 'partial' : (results.errors > 0 ? 'partial' : 'completed');

    // Final history update
    await supabaseClient
      .from('import_history')
      .update({
        imported_count: results.imported,
        skipped_count: results.skipped,
        error_count: results.errors,
        total_processed: results.totalInFeed,
        duration_ms: results.duration,
        completed_at: !hasMore ? new Date().toISOString() : null,
        status: finalStatus,
        metadata: {
          totalPages: results.totalPages,
          totalInFeed: results.totalInFeed,
          lastProcessedPage: currentPage - 1,
          nextPage: hasMore ? currentPage : null,
          resumable: hasMore,
          note: hasMore
            ? `Processed ${maxPages} pages. Auto-resume will continue from page ${currentPage}.`
            : 'Fast import without AI processing completed'
        }
      })
      .eq('id', historyId);

    await broadcastProgress({
      phase: hasMore ? 'processing' : 'complete',
      currentPage: results.totalPages,
      totalPages: results.totalPages,
      articlesCollected: results.totalInFeed,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
      percentComplete: hasMore ? 50 : 100,
      message: hasMore 
        ? `Batch complete. Auto-resume will continue from page ${currentPage}.`
        : 'Import complete!'
    });

    console.log(hasMore ? '\n⏸️ Batch complete, marked as partial (resumable)' : '\n✅ Aerospace FAST import completed:', results);

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
          totalPages: results.totalPages,
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
  const resumeFromHistory = body.resumeHistoryId;

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

    let historyId: string;
    let startPage = 1;

    if (resumeFromHistory) {
      // Resume existing import
      const { data: existingHistory } = await supabaseClient
        .from('import_history')
        .select('*')
        .eq('id', resumeFromHistory)
        .maybeSingle();

      if (!existingHistory || existingHistory.status !== 'partial' || !(existingHistory.metadata as any)?.nextPage) {
        throw new Error('Cannot resume: import not found or not resumable');
      }

      historyId = resumeFromHistory;
      startPage = (existingHistory.metadata as any)?.nextPage || 1;
      
      console.log(`Admin ${user.email} resuming import from page ${startPage}`);

      // Update status
      await supabaseClient
        .from('import_history')
        .update({ status: 'in_progress' })
        .eq('id', historyId);
    } else {
      // Create new import history
      console.log(`Admin ${user.email} starting new FAST import`);
      
      const { data: historyRecord } = await supabaseClient
        .from('import_history')
        .insert({
          vertical_slug: 'aerospace',
          status: 'in_progress',
          imported_by: user.id,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      historyId = historyRecord?.id;
    }

    if (!historyId) {
      throw new Error('Failed to create import history record');
    }

    // Start background import using waitUntil (50 pages at a time)
    const ctx = Deno.env.get('DENO_REGION') ? (globalThis as any).EdgeRuntime : null;
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(runBackgroundImport(supabaseClient, historyId, user.id, startPage, 50));
    } else {
      // Fallback for local development
      runBackgroundImport(supabaseClient, historyId, user.id, startPage, 50).catch(console.error);
    }

    // Return immediately
    return new Response(
      JSON.stringify({
        success: true,
        message: resumeFromHistory 
          ? `Resuming import from page ${startPage} in background.`
          : 'Import started in background. Processes 50 pages at a time.',
        historyId: historyId,
        vertical: 'aerospace',
        startPage,
        note: 'Click Resume if needed after each batch completes.'
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
        error: error.message,
        duration: Date.now() - startTime
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

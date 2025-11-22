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

async function processImportBatch(
  supabaseClient: any,
  historyId: string,
  startPage: number,
  maxPages: number = 50
) {
  const startTime = Date.now();
  console.log(`📦 Processing batch from page ${startPage}, max ${maxPages} pages`);

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

  try {
    // Get current counts from history
    const { data: currentHistory } = await supabaseClient
      .from('import_history')
      .select('*')
      .eq('id', historyId)
      .single();

    if (currentHistory) {
      results.imported = currentHistory.imported_count;
      results.skipped = currentHistory.skipped_count;
      results.errors = currentHistory.error_count;
      results.totalInFeed = currentHistory.total_processed;
    }

    while (hasMorePages && currentPage <= endPage) {
      console.log(`📄 Fetching page ${currentPage} (${currentPage - startPage + 1}/${maxPages})...`);
      
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
        console.log(`🏁 Reached last page (page ${currentPage} has 0 articles)`);
        hasMorePages = false;
        break;
      }

      results.totalPages = currentPage;
      results.totalInFeed += pageArticles.length;

      for (const article of pageArticles) {
        try {
          const postId = article.post_id || article.id;
          
          if (!postId) {
            results.errors++;
            continue;
          }

          const { data: existingArticle } = await supabaseClient
            .from('articles')
            .select('id, post_id')
            .eq('post_id', postId)
            .maybeSingle();

          if (existingArticle) {
            results.skipped++;
            continue;
          }

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

      // Update history after every page for real-time UI updates
      await supabaseClient
        .from('import_history')
        .update({
          status: 'in_progress',
          imported_count: results.imported,
          skipped_count: results.skipped,
          error_count: results.errors,
          total_processed: results.totalInFeed,
          metadata: {
            totalPages: results.totalPages,
            currentPage: currentPage,
            totalInFeed: results.totalInFeed,
            lastProcessedPage: currentPage,
            nextPage: currentPage + 1,
            note: 'Auto-resuming import (in progress)'
          }
        })
        .eq('id', historyId);

      console.log(`✅ Page ${currentPage} complete: ${results.imported} total imported`);

      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    results.duration = Date.now() - startTime;
    
    const hasMore = hasMorePages && currentPage <= endPage;
    const finalStatus = hasMore ? 'partial' : (results.errors > 0 ? 'partial' : 'completed');

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
            ? `Auto-resume: Processed ${maxPages} pages, will continue from page ${currentPage}` 
            : 'Auto-resume: Import completed'
        }
      })
      .eq('id', historyId);

    console.log(hasMore ? '\n⏸️ Batch complete, will auto-resume' : '\n✅ Import complete:', results);

  } catch (error) {
    console.error('Batch processing error:', error);
    
    await supabaseClient
      .from('import_history')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        metadata: {
          error: error.message,
          totalPages: results.totalPages,
          note: 'Auto-resume failed'
        }
      })
      .eq('id', historyId);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🤖 Auto-resume cron job triggered');

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find imports that need resuming
    const { data: pendingImports, error } = await supabaseClient
      .from('import_history')
      .select('*')
      .eq('status', 'partial')
      .eq('vertical_slug', 'aerospace')
      .order('started_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error finding pending imports:', error);
      throw error;
    }

    if (!pendingImports || pendingImports.length === 0) {
      console.log('✓ No imports need resuming');
      return new Response(
        JSON.stringify({ message: 'No imports to resume' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const importToResume = pendingImports.find((imp: any) => (imp.metadata as any)?.nextPage || (imp.metadata as any)?.resumable);

    if (!importToResume) {
      console.log('✓ No resumable imports found');
      return new Response(
        JSON.stringify({ message: 'No resumable imports found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nextPage = (importToResume.metadata as any)?.nextPage || 1;

    console.log(`🔄 Auto-resuming import ${importToResume.id} from page ${nextPage}`);

    // Update status to in_progress
    await supabaseClient
      .from('import_history')
      .update({ status: 'in_progress' })
      .eq('id', importToResume.id);

    // Start the batch processing
    const ctx = Deno.env.get('DENO_REGION') ? (globalThis as any).EdgeRuntime : null;
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(processImportBatch(supabaseClient, importToResume.id, nextPage, 50));
    } else {
      processImportBatch(supabaseClient, importToResume.id, nextPage, 50).catch(console.error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Auto-resumed import from page ${nextPage}`,
        importId: importToResume.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auto-resume error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

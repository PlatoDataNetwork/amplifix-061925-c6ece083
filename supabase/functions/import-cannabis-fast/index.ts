// Cannabis Fast Import with Realtime Progress Updates
// Updated: 2025-11-30 - Fixed JSON response parsing
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrlEnv = Deno.env.get("SUPABASE_URL");
const supabaseServiceKeyEnv = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Global Supabase client to avoid ReferenceError in any execution path
const supabase =
  supabaseUrlEnv && supabaseServiceKeyEnv
    ? createClient(supabaseUrlEnv, supabaseServiceKeyEnv)
    : null;

interface CannabisArticle {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  link?: string;
  date?: string;
  author?: string;
  featured_media?: string;
  yoast_head_json?: {
    og_image?: Array<{ url: string }>;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

function cleanText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

async function runBackgroundImport(
  supabaseUrl: string,
  supabaseKey: string,
  jsonUrl: string,
  importHistoryId: string,
  startedAt: string,
  resumeFromPage?: number,
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const channel = supabase.channel(`import-progress-cannabis`);

  let totalProcessed = 0;
  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let page = resumeFromPage || 1;
  const batchSize = 20;
  
  console.log(`Starting import from page ${page}${resumeFromPage ? ' (RESUMING)' : ' (NEW)'}`);
  
  // If resuming, load existing counts from import history
  if (resumeFromPage) {
    const { data: existingData } = await supabase
      .from('import_history')
      .select('total_processed, imported_count, skipped_count, error_count')
      .eq('id', importHistoryId)
      .single();
    
    if (existingData) {
      totalProcessed = existingData.total_processed || 0;
      importedCount = existingData.imported_count || 0;
      skippedCount = existingData.skipped_count || 0;
      errorCount = existingData.error_count || 0;
      console.log(`Resuming with existing counts: ${importedCount} imported, ${skippedCount} skipped`);
    }
  }

  try {
    await channel.subscribe();

    while (true) {
      // First, check the current import_history row for an explicit cancel or status change
      const { data: importRow, error: importRowError } = await supabase
        .from("import_history")
        .select("cancelled, status")
        .eq("id", importHistoryId)
        .maybeSingle();

      if (importRowError) {
        console.error("Error checking import status:", importRowError);
      } else if (!importRow) {
        console.error("Import history record not found, stopping import.");
        return;
      } else if (
        importRow.cancelled ||
        importRow.status === "failed"
      ) {
        console.log("Import stopped due to status/cancellation flag");
        await channel.send({
          type: "broadcast",
          event: "import_cancelled",
          payload: { vertical: "cannabis" },
        });
        return;
      }

      // Fallback to generic cancellation RPC so other admin tools can also signal a stop
      const { data: shouldCancel } = await supabase.rpc("should_cancel_import", {
        p_vertical_slug: "cannabis",
        p_started_after: startedAt,
      });

      if (shouldCancel) {
        console.log("Import cancelled by user (RPC signal)");
        await supabase
          .from("import_history")
          .update({
            status: "failed",
            cancelled: true,
            completed_at: new Date().toISOString(),
            total_processed: totalProcessed,
            imported_count: importedCount,
            skipped_count: skippedCount,
            error_count: errorCount,
          })
          .eq("id", importHistoryId);

        await channel.send({
          type: "broadcast",
          event: "import_cancelled",
          payload: { vertical: "cannabis" },
        });
        return;
      }

      const pageUrl = `${jsonUrl}${jsonUrl.includes("?") ? "&" : "?"}page=${page}`;
      console.log(`Fetching cannabis page ${page} from ${pageUrl}`);

      const response = await fetch(pageUrl);
      if (!response.ok) {
        const errorMsg = `Failed to fetch page ${page}: ${response.status} ${response.statusText}`;
        console.error(errorMsg);
        
        // If this is the very first page, mark as failed with error details
        if (page === 1) {
          await supabase
            .from("import_history")
            .update({
              status: "failed",
              completed_at: new Date().toISOString(),
              error_count: 1,
              metadata: {
                ...((await supabase.from("import_history").select("metadata").eq("id", importHistoryId).single()).data?.metadata || {}),
                errorMessage: errorMsg,
                failureReason: `Source feed returned ${response.status} on initial request`,
              },
            })
            .eq("id", importHistoryId);
          
          throw new Error(errorMsg);
        }
        break;
      }

      const responseData = await response.json();
      console.log(`Raw response type: ${Array.isArray(responseData) ? 'array' : typeof responseData}`);
      
      let articles: CannabisArticle[] = [];
      
      // Handle different response structures
      if (Array.isArray(responseData)) {
        articles = responseData;
      } else if (responseData && typeof responseData === 'object') {
        // Try different common field names
        if (Array.isArray(responseData.articles)) {
          articles = responseData.articles;
        } else if (Array.isArray(responseData.posts)) {
          articles = responseData.posts;
        } else if (Array.isArray(responseData.data)) {
          articles = responseData.data;
        } else if (Array.isArray(responseData.items)) {
          articles = responseData.items;
        }
      }
      
      console.log(`Parsed ${articles.length} articles from response`);

      if (!articles || articles.length === 0) {
        console.log(`No more articles found at page ${page}`);
        break;
      }

      const batch = [];
      for (const article of articles) {
        try {
          const postId = article.id;
          const { data: existing } = await supabase
            .from("articles")
            .select("id")
            .eq("post_id", postId)
            .eq("vertical_slug", "cannabis")
            .maybeSingle();

          if (existing) {
            skippedCount++;
            totalProcessed++;
            continue;
          }

          let imageUrl = null;
          if (article._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
            imageUrl = article._embedded["wp:featuredmedia"][0].source_url;
          } else if (article.yoast_head_json?.og_image?.[0]?.url) {
            imageUrl = article.yoast_head_json.og_image[0].url;
          }

          batch.push({
            title: cleanText(article.title?.rendered),
            excerpt: cleanText(article.excerpt?.rendered),
            content: cleanText(article.content?.rendered),
            external_url: article.link || null,
            published_at: article.date || new Date().toISOString(),
            author: article.author || null,
            image_url: imageUrl,
            vertical_slug: "cannabis",
            post_id: postId,
            metadata: {},
          });
        } catch (articleError) {
          console.error("Error processing article:", articleError);
          errorCount++;
        }
      }

      if (batch.length > 0) {
        const { error: insertError } = await supabase
          .from("articles")
          .insert(batch);

        if (insertError) {
          console.error("Batch insert error:", insertError);
          errorCount += batch.length;
        } else {
          importedCount += batch.length;
        }
      }

      totalProcessed += articles.length;

      await supabase
        .from("import_history")
        .update({
          total_processed: totalProcessed,
          imported_count: importedCount,
          skipped_count: skippedCount,
          error_count: errorCount,
          metadata: {
            jsonUrl,
            lastProcessedPage: page,
          },
        })
        .eq("id", importHistoryId);

      await channel.send({
        type: "broadcast",
        event: "import_progress",
        payload: {
          vertical: "cannabis",
          totalProcessed,
          importedCount,
          skippedCount,
          errorCount,
          currentPage: page,
        },
      });

      console.log(`Page ${page} complete - Imported: ${importedCount}, Skipped: ${skippedCount}`);

      // Move to next page; loop will stop when the API returns 0 articles
      page++;
    }

    const completedAt = new Date().toISOString();
    const startTime = new Date(startedAt).getTime();
    const endTime = new Date(completedAt).getTime();
    const durationMs = endTime - startTime;

    await supabase
      .from("import_history")
      .update({
        status: "completed",
        completed_at: completedAt,
        duration_ms: durationMs,
        total_processed: totalProcessed,
        imported_count: importedCount,
        skipped_count: skippedCount,
        error_count: errorCount,
      })
      .eq("id", importHistoryId);

    await channel.send({
      type: "broadcast",
      event: "import_complete",
      payload: {
        vertical: "cannabis",
        totalProcessed,
        importedCount,
        skippedCount,
        errorCount,
      },
    });

    console.log("Import complete:", {
      totalProcessed,
      importedCount,
      skippedCount,
      errorCount,
    });
  } catch (error) {
    console.error("Import error:", error);
    await supabase
      .from("import_history")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        total_processed: totalProcessed,
        imported_count: importedCount,
        skipped_count: skippedCount,
        error_count: errorCount,
      })
      .eq("id", importHistoryId);
  } finally {
    await channel.unsubscribe();
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Use anon key + user token for auth / role checks
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      console.error("Auth error in import-cannabis-fast:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: hasAdminRole, error: roleError } = await supabaseAuth.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (roleError || !hasAdminRole) {
      console.error("Role check failed in import-cannabis-fast:", roleError);
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json();
    const jsonUrl = body.jsonUrl || "https://platodata.ai/cannabis/json/";
    const resumeImportId = body.resumeImportId;
    const startedAt = new Date().toISOString();

    console.log(`Cannabis import - jsonUrl: ${jsonUrl}, resumeImportId: ${resumeImportId}, isResume: ${!!resumeImportId}`);

    // Create service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let importHistoryId: string;
    let resumeFromPage: number | undefined = undefined;

    if (resumeImportId) {
      const { data: existingImport } = await supabase
        .from("import_history")
        .select("*")
        .eq("id", resumeImportId)
        .eq("vertical_slug", "cannabis")
        .single();

      if (!existingImport) {
        return new Response(
          JSON.stringify({ error: "Import history not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }

      // Get the last processed page from metadata
      const metadata = existingImport.metadata as any;
      const lastPage = metadata?.lastProcessedPage || 0;
      resumeFromPage = lastPage + 1; // Resume from next page
      
      console.log(`Resuming import from page ${resumeFromPage} (last processed: ${lastPage})`);

      importHistoryId = resumeImportId;
      await supabase
        .from("import_history")
        .update({
          status: "in_progress",
          started_at: startedAt,
          cancelled: false,
        })
        .eq("id", importHistoryId);
    } else {
      // Look across recent imports to find the highest lastProcessedPage
      console.log('Scanning recent imports to find max lastProcessedPage...');
      
      const { data: recentImports, error: recentError } = await supabase
        .from("import_history")
        .select('*')
        .eq('vertical_slug', 'cannabis')
        .order('started_at', { ascending: false })
        .limit(50);

      if (recentError) {
        console.error('Error loading recent imports, falling back to fresh start:', recentError);
      }

      let maxLastPage = 0;
      let sourceImportId: string | null = null;
      let sourceMetadata: any = null;

      if (recentImports && recentImports.length > 0) {
        for (const imp of recentImports) {
          const m = imp.metadata as any;
          const raw = m?.lastProcessedPage;
          const lp =
            typeof raw === 'number'
              ? raw
              : raw
                ? parseInt(String(raw), 10) || 0
                : 0;

          if (lp > maxLastPage) {
            maxLastPage = lp;
            sourceImportId = imp.id;
            sourceMetadata = m || {};
          }
        }
      }

      if (maxLastPage > 0 && sourceImportId) {
        // Cancel any in-progress imports before starting the resume run
        await supabase
          .from("import_history")
          .update({
            status: 'failed',
            cancelled: true,
            completed_at: new Date().toISOString(),
            metadata: {
              failureReason: 'Superseded by resume import from max lastProcessedPage',
            },
          })
          .eq('vertical_slug', 'cannabis')
          .eq('status', 'in_progress');

        resumeFromPage = maxLastPage + 1;

        console.log(
          `Resuming cannabis import from highest lastProcessedPage ${maxLastPage} (source import ${sourceImportId}), starting at page ${resumeFromPage}`,
        );

        const { data: newImport, error: insertError } = await supabase
          .from("import_history")
          .insert({
            vertical_slug: "cannabis",
            started_at: startedAt,
            status: "in_progress",
            imported_by: user.id,
            metadata: {
              ...(sourceMetadata || {}),
              jsonUrl,
              importType: 'resume_from_max',
              resumedFromPage: resumeFromPage,
              maxLastProcessedPage: maxLastPage,
              sourceImportId,
            },
          })
          .select()
          .single();

        if (insertError || !newImport) {
          throw new Error("Failed to create import history");
        }

        importHistoryId = newImport.id;
        console.log(
          `New resume import created with ID: ${importHistoryId}, will start from page ${resumeFromPage}`,
        );
      } else {
        // No usable lastProcessedPage found - start fresh
        console.log(
          'No previous lastProcessedPage found, creating NEW import (starting fresh from page 1)',
        );

        const { data: newImport, error: insertError } = await supabase
          .from("import_history")
          .insert({
            vertical_slug: "cannabis",
            started_at: startedAt,
            status: "in_progress",
            imported_by: user.id,
            metadata: {
              jsonUrl,
              importType: 'fresh',
              startedFromPage: 1,
            },
          })
          .select()
          .single();

        if (insertError || !newImport) {
          throw new Error("Failed to create import history");
        }

        importHistoryId = newImport.id;
        resumeFromPage = undefined;
        console.log(
          `New import created with ID: ${importHistoryId}, will start from page 1`,
        );
      }
    }

    EdgeRuntime.waitUntil(
      runBackgroundImport(
        supabaseUrl,
        supabaseServiceKey,
        jsonUrl || "https://platodata.ai/cannabis/json/",
        importHistoryId,
        startedAt,
        resumeFromPage,
      ),
    );

    return new Response(
      JSON.stringify({
        message: "Cannabis import started in background",
        importHistoryId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: any) {
    console.error("Error starting import:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to start import",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});

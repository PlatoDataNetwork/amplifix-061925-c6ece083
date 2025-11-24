import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

interface AviationArticle {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    author?: Array<{
      name: string;
    }>;
  };
}

function cleanText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\[&#8230;\]/g, "...")
    .replace(/\s+/g, " ")
    .trim();
}

async function runBackgroundImport(
  supabaseAdmin: any,
  importId: string,
  userId: string,
  resumeFromPage?: number,
) {
  const startTime = Date.now();
  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let currentPage = resumeFromPage || 1;
  let hasMore = true;

  console.log("Starting Aviation background import", {
    importId,
    userId,
    startingPage: currentPage,
  });

  try {
    while (hasMore) {
      console.log(`Fetching Aviation page ${currentPage}`);

      const feedUrl = `https://platodata.ai/aviation/json/?page=${currentPage}`;
      const feedResponse = await fetch(feedUrl);

      if (!feedResponse.ok) {
        console.error("Failed to fetch Aviation feed", {
          status: feedResponse.status,
          page: currentPage,
        });
        totalErrors++;
        break;
      }

      const articles: AviationArticle[] = await feedResponse.json();

      if (!articles || articles.length === 0) {
        console.log("No more articles found, ending import");
        hasMore = false;
        break;
      }

      console.log(`Processing ${articles.length} articles from page ${currentPage}`);

      for (const article of articles) {
        try {
          const title = cleanText(article.title?.rendered);
          const excerpt = cleanText(article.excerpt?.rendered);
          const content = cleanText(article.content?.rendered);
          const author = article._embedded?.author?.[0]?.name || "Unknown";
          const imageUrl = article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
          const externalUrl = article.link || null;

          if (!title || title.length < 3) {
            console.log("Skipping article with invalid title", { id: article.id });
            totalSkipped++;
            continue;
          }

          const { data: existing, error: checkError } = await supabaseAdmin
            .from("articles")
            .select("id")
            .eq("post_id", article.id)
            .eq("vertical_slug", "aviation")
            .maybeSingle();

          if (checkError) {
            console.error("Error checking for existing article", {
              error: checkError,
              postId: article.id,
            });
            totalErrors++;
            continue;
          }

          if (existing) {
            console.log("Article already exists, skipping", { postId: article.id });
            totalSkipped++;
            continue;
          }

          const { error: insertError } = await supabaseAdmin.from("articles").insert({
            post_id: article.id,
            title,
            excerpt,
            content,
            author,
            image_url: imageUrl,
            external_url: externalUrl,
            published_at: article.date,
            vertical_slug: "aviation",
            metadata: {
              imported_at: new Date().toISOString(),
              import_id: importId,
              source: "platodata-aviation",
            },
          });

          if (insertError) {
            console.error("Error inserting article", {
              error: insertError,
              postId: article.id,
              title,
            });
            totalErrors++;
          } else {
            totalImported++;
            console.log("Article imported successfully", { postId: article.id, title });
          }
        } catch (articleError) {
          console.error("Error processing article", {
            error: articleError,
            articleId: article.id,
          });
          totalErrors++;
        }
      }

      const progress = {
        currentPage,
        totalImported,
        totalSkipped,
        totalErrors,
        articlesInPage: articles.length,
      };

      console.log("Page complete, broadcasting progress", progress);

      await supabaseAdmin.channel(`import-progress-${importId}`).send({
        type: "broadcast",
        event: "progress",
        payload: progress,
      });

      await supabaseAdmin
        .from("import_history")
        .update({
          imported_count: totalImported,
          skipped_count: totalSkipped,
          error_count: totalErrors,
          total_processed: totalImported + totalSkipped + totalErrors,
          metadata: {
            current_page: currentPage,
            last_update: new Date().toISOString(),
          },
        })
        .eq("id", importId);

      currentPage++;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const durationMs = Date.now() - startTime;

    await supabaseAdmin
      .from("import_history")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        imported_count: totalImported,
        skipped_count: totalSkipped,
        error_count: totalErrors,
        total_processed: totalImported + totalSkipped + totalErrors,
        duration_ms: durationMs,
      })
      .eq("id", importId);

    console.log("Aviation import completed", {
      importId,
      totalImported,
      totalSkipped,
      totalErrors,
      durationMs,
    });

    await supabaseAdmin.channel(`import-progress-${importId}`).send({
      type: "broadcast",
      event: "complete",
      payload: {
        totalImported,
        totalSkipped,
        totalErrors,
        durationMs,
      },
    });
  } catch (error) {
    console.error("Fatal error in Aviation import", { error, importId });

    await supabaseAdmin
      .from("import_history")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        error_count: totalErrors + 1,
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          failed_at: new Date().toISOString(),
        },
      })
      .eq("id", importId);

    await supabaseAdmin.channel(`import-progress-${importId}`).send({
      type: "broadcast",
      event: "error",
      payload: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      },
    );

    console.log("Authenticating user...");

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Authentication failed:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("User authenticated:", user.email);

    const { data: isAdmin, error: roleError } = await supabaseClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (roleError || !isAdmin) {
      console.error("Admin check failed:", roleError, "isAdmin:", isAdmin);
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Admin verified");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json().catch(() => ({}));
    const { resumeImportId, resumeFromPage } = body;

    let importId: string;

    if (resumeImportId) {
      console.log("Resuming Aviation import", { resumeImportId, resumeFromPage });
      importId = resumeImportId;

      await supabaseAdmin
        .from("import_history")
        .update({
          status: "in_progress",
          metadata: {
            resumed_at: new Date().toISOString(),
            resume_page: resumeFromPage,
          },
        })
        .eq("id", importId);
    } else {
      console.log("Starting new Aviation import");

      const { data: newImport, error: createError } = await supabaseAdmin
        .from("import_history")
        .insert({
          vertical_slug: "aviation",
          status: "in_progress",
          imported_by: user.id,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError || !newImport) {
        console.error("Failed to create import history", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create import history" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      importId = newImport.id;
    }

    if (typeof req.waitUntil === "function") {
      req.waitUntil(
        runBackgroundImport(supabaseAdmin, importId, user.id, resumeFromPage),
      );
    } else {
      runBackgroundImport(supabaseAdmin, importId, user.id, resumeFromPage);
    }

    return new Response(
      JSON.stringify({
        success: true,
        importId,
        message: resumeImportId
          ? "Aviation import resumed in background"
          : "Aviation import started in background",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in import-aviation-fast", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

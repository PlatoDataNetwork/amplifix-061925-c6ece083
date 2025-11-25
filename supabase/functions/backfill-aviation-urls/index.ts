import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

interface ProgressUpdate {
  phase: string;
  currentArticle: number;
  totalArticles: number;
  updated: number;
  skipped: number;
  errors: number;
  percentage: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const resumeFromOffset = body.resumeFromOffset || 0;
    console.log(`Resume from offset: ${resumeFromOffset}`);

    const authHeader = req.headers.get("Authorization");
    console.log("Auth header received:", authHeader ? "Yes" : "No");
    
    if (!authHeader) {
      console.log("❌ No authorization header");
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    let userId: string | null = null;
    let userEmail: string | null = null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);
      userId = payload.sub || null;
      userEmail = payload.email || payload.user_metadata?.email || null;
    } catch (e) {
      console.error("Error decoding JWT:", e);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: "Invalid JWT" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("User check via JWT:", { hasUserId: !!userId, userEmail });

    if (!userId) {
      console.log("❌ User authentication failed - no user id in token");
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: "Missing user id in token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    console.log("Admin check:", { isAdmin, userId, roleError: roleError?.message });

    if (roleError || !isAdmin) {
      console.log("❌ User is not admin or role check failed");
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("✅ Starting backfill for admin user:", userEmail || userId);

    const channelName = `aviation-backfill-${crypto.randomUUID()}`;
    const startedAt = new Date().toISOString();

    // Create import history record
    const { data: importRecord, error: importError } = await supabaseAdmin
      .from("import_history")
      .insert({
        vertical_slug: "aviation",
        status: "in_progress",
        started_at: startedAt,
        imported_count: 0,
        skipped_count: 0,
        error_count: 0,
        total_processed: 0,
        cancelled: false,
        metadata: { 
          type: "url_backfill",
          resumeFromOffset,
          lastProcessedOffset: resumeFromOffset
        }
      })
      .select()
      .single();

    if (importError || !importRecord) {
      console.error("Failed to create import history record:", importError);
      throw new Error("Failed to initialize backfill tracking");
    }

    const importId = importRecord.id;
    console.log("Created import history record:", importId);

    async function runBackfill() {
      let updated = 0;
      let skipped = 0;
      let errors = 0;

      console.log("Starting Aviation URL backfill with batch processing");

      const BATCH_SIZE = 100;
      const BATCH_DELAY_MS = 2000; // 2 second delay between batches
      const ARTICLE_DELAY_MS = 300; // 300ms delay between articles
      const PAGE_SIZE = 1000; // Number of rows to fetch from DB per page (PostgREST max rows)

      type ArticleRecord = {
        id: string;
        post_id: number | null;
        external_url: string | null;
      };

      let allArticles: ArticleRecord[] = [];
      let offset = 0;

      console.log("Fetching Aviation articles in pages from Supabase");

      while (true) {
        const { data, error, count } = await supabaseAdmin
          .from("articles")
          .select("id, post_id, external_url", { count: "exact" })
          .eq("vertical_slug", "aviation")
          .is("external_url", null)
          .order("created_at", { ascending: false })
          .range(offset, offset + PAGE_SIZE - 1);

        if (error) {
          console.error("Error fetching articles page:", { offset, error });
          throw error;
        }

        if (!data || data.length === 0) {
          break;
        }

        allArticles = allArticles.concat(data as ArticleRecord[]);

        console.log(
          `Fetched page starting at offset ${offset}, got ${data.length} articles (total so far: ${allArticles.length}${
            typeof count === "number" ? ` of ~${count}` : ""
          })`,
        );

        if (data.length < PAGE_SIZE) {
          // Last page reached
          break;
        }

        offset += PAGE_SIZE;
      }

      if (allArticles.length === 0) {
        console.log("No Aviation articles found to backfill");
        return { updated: 0, skipped: 0, errors: 0 };
      }

      const totalArticles = allArticles.length;
      
      // Skip to resume offset if provided
      if (resumeFromOffset > 0 && resumeFromOffset < totalArticles) {
        console.log(`Resuming from offset ${resumeFromOffset}, skipping first ${resumeFromOffset} articles`);
        allArticles = allArticles.slice(resumeFromOffset);
      }
      
      const totalBatches = Math.ceil(allArticles.length / BATCH_SIZE);
      console.log(`Found ${totalArticles} total Aviation articles, processing ${allArticles.length} articles in ${totalBatches} batches`);

      // Process articles in batches
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * BATCH_SIZE;
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalArticles);
        const batch = allArticles.slice(batchStart, batchEnd);

        console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (articles ${batchStart + 1}-${batchEnd})`);

        // Check for cancellation at the start of each batch
        const { data: shouldCancel } = await supabaseAdmin.rpc("should_cancel_import", {
          p_vertical_slug: "aviation",
          p_started_after: startedAt
        });

        if (shouldCancel) {
          console.log("❌ Backfill cancelled by user");
          await supabaseAdmin
            .from("import_history")
            .update({
              status: "cancelled",
              completed_at: new Date().toISOString(),
              imported_count: updated,
              skipped_count: skipped,
              error_count: errors,
              total_processed: updated + skipped + errors
            })
            .eq("id", importId);

          await supabaseAdmin.channel(channelName).send({
            type: "broadcast",
            event: "cancelled",
            payload: {
              phase: "cancelled",
              currentArticle: overallIndex,
              totalArticles,
              updated,
              skipped,
              errors,
              percentage: Math.round((overallIndex / totalArticles) * 100),
            } satisfies ProgressUpdate,
          });

          return { updated, skipped, errors, cancelled: true };
        }

        for (let i = 0; i < batch.length; i++) {
          const article = batch[i];
          const overallIndex = batchStart + i;
          const absoluteIndex = resumeFromOffset + overallIndex;

          try {
            // Update metadata with last processed offset
            const updateData: any = {
              metadata: { 
                type: "url_backfill",
                resumeFromOffset,
                lastProcessedOffset: absoluteIndex
              }
            };

            // Every 50 articles, also update the counts so progress is visible
            if ((absoluteIndex + 1) % 50 === 0) {
              updateData.imported_count = updated;
              updateData.skipped_count = skipped;
              updateData.error_count = errors;
              updateData.total_processed = updated + skipped + errors;
              console.log(`💾 Saving progress checkpoint: ${updated} updated, ${skipped} skipped, ${errors} errors`);
            }

            await supabaseAdmin
              .from("import_history")
              .update(updateData)
              .eq("id", importId);

            // Send progress update
            await supabaseAdmin.channel(channelName).send({
              type: "broadcast",
              event: "progress",
              payload: {
                phase: "processing",
                currentArticle: absoluteIndex + 1,
                totalArticles,
                updated,
                skipped,
                errors,
                percentage: Math.round(((absoluteIndex + 1) / totalArticles) * 100),
              } satisfies ProgressUpdate,
            });

            // Skip if already has external_url (shouldn't happen with the query filter, but double-check)
            if (article.external_url && article.external_url.trim() !== "") {
              console.log(`Article ${article.id} already has external_url, skipping`);
              skipped++;
              continue;
            }

            // Skip if no post_id
            if (!article.post_id) {
              console.log(`Article ${article.id} has no post_id, skipping`);
              skipped++;
              continue;
            }

            // Fetch article data from Aviation API using GET with post_id parameter
            const aviationUrl = `https://platodata.ai/aviation/json/?post_id=${article.post_id}`;
            console.log(`Fetching Aviation article from: ${aviationUrl}`);
            const response = await fetch(aviationUrl);

            if (!response.ok) {
              console.error(`Failed to fetch article ${article.post_id}: ${response.status}`);
              errors++;
              continue;
            }

            const contentType = response.headers.get("content-type") || "";
            let data: any;

            try {
              if (contentType.includes("application/json")) {
                data = await response.json();
              } else {
                const text = await response.text();
                console.error(
                  `Non-JSON response for article ${article.post_id}. Content-Type: ${contentType}. Preview: ${text.slice(0, 200)}`,
                );
                errors++;
                continue;
              }
            } catch (parseError) {
              console.error(`Failed to parse JSON for article ${article.post_id}:`, parseError);
              errors++;
              continue;
            }

            // Extract source URL from the response
            let sourceUrl: string | null = null;
            
            if (data?.posts && Array.isArray(data.posts) && data.posts.length > 0) {
              // Response structure: { posts: [{ source: "..." }] }
              sourceUrl = data.posts[0]?.source;
            } else if (Array.isArray(data) && data.length > 0) {
              // Response structure: [{ source: "..." }]
              sourceUrl = data[0]?.source;
            } else if (data?.source) {
              // Response structure: { source: "..." }
              sourceUrl = data.source;
            }

            if (!sourceUrl || sourceUrl.trim() === "") {
              console.error(`No source URL found for article ${article.post_id}`);
              errors++;
              continue;
            }

            // Update article with source URL
            const { error: updateError } = await supabaseAdmin
              .from("articles")
              .update({ external_url: sourceUrl })
              .eq("id", article.id);

            if (updateError) {
              console.error(`Error updating article ${article.id}:`, updateError);
              errors++;
            } else {
              updated++;
              if (updated % 10 === 0) {
                console.log(`Progress: ${updated} articles updated so far`);
              }
            }

            // Small delay between articles
            await new Promise((resolve) => setTimeout(resolve, ARTICLE_DELAY_MS));
          } catch (error) {
            console.error(`Error processing article ${article.id}:`, error);
            errors++;
          }
        }

        // Delay between batches (except for the last batch)
        if (batchIndex < totalBatches - 1) {
          console.log(`Batch ${batchIndex + 1} complete. Waiting ${BATCH_DELAY_MS}ms before next batch...`);
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
        }
      }

      // Update import history on completion
      await supabaseAdmin
        .from("import_history")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          imported_count: updated,
          skipped_count: skipped,
          error_count: errors,
          total_processed: updated + skipped + errors,
          duration_ms: Date.now() - new Date(startedAt).getTime()
        })
        .eq("id", importId);

      // Send completion event
      await supabaseAdmin.channel(channelName).send({
        type: "broadcast",
        event: "complete",
        payload: {
          phase: "complete",
          currentArticle: totalArticles,
          totalArticles,
          updated,
          skipped,
          errors,
          percentage: 100,
        } satisfies ProgressUpdate,
      });

      console.log("Aviation URL backfill complete", { 
        totalArticles,
        updated, 
        skipped, 
        errors,
        successRate: `${((updated / totalArticles) * 100).toFixed(2)}%`
      });

      return { updated, skipped, errors };
    }

    if (typeof req.waitUntil === "function") {
      req.waitUntil(runBackfill());
    } else {
      runBackfill();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Aviation URL backfill started",
        channelName,
        importId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in backfill-aviation-urls:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

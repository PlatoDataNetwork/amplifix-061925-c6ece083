import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Article formatting function with list support
const formatArticleContent = (text?: string | null): string => {
  if (!text) return "";

  // Sanitize text
  let cleaned = text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/<\/?p>/gi, "")
    .replace(/<\/?div>/gi, "")
    .replace(/<\/?span>/gi, "")
    .replace(/<\/?ul>/gi, "")
    .replace(/<\/?ol>/gi, "")
    .replace(/<\/?li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();

  const lines = cleaned.split("\n");
  const htmlParts: string[] = [];
  let currentParagraphLines: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const paragraphText = currentParagraphLines.join(" ").trim();
      if (paragraphText) {
        htmlParts.push(`<p>${paragraphText}</p>`);
      }
      currentParagraphLines = [];
    }
  };

  const closeLists = () => {
    if (inUnorderedList) {
      htmlParts.push("</ul>");
      inUnorderedList = false;
    }
    if (inOrderedList) {
      htmlParts.push("</ol>");
      inOrderedList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeLists();
      continue;
    }

    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)/);

    if (bulletMatch) {
      flushParagraph();
      if (!inUnorderedList) {
        closeLists();
        htmlParts.push("<ul>");
        inUnorderedList = true;
      }
      htmlParts.push(`<li>${bulletMatch[1].trim()}</li>`);
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      if (!inOrderedList) {
        closeLists();
        htmlParts.push("<ol>");
        inOrderedList = true;
      }
      htmlParts.push(`<li>${orderedMatch[2].trim()}</li>`);
      continue;
    }

    closeLists();
    currentParagraphLines.push(line);
  }

  flushParagraph();
  closeLists();

  return htmlParts.join("\n");
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { chunkIndex = 0, chunkSize = 1000 } = await req.json();
    
    console.log(`Processing chunk ${chunkIndex} with size ${chunkSize}`);

    // First, get the total count if this is the first chunk
    if (chunkIndex === 0) {
      const { count: totalCount, error: countError } = await supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .not('content', 'is', null);

      if (countError) {
        console.error('Error counting articles:', countError);
        throw countError;
      }

      console.log(`Total articles to format: ${totalCount || 0}`);
    }

    // Calculate offset
    const offset = chunkIndex * chunkSize;
    
    // Fetch articles for this chunk
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, post_id, content, title')
      .not('content', 'is', null)
      .range(offset, offset + chunkSize - 1);

    if (fetchError) {
      console.error('Error fetching articles:', fetchError);
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          hasMore: false,
          processed: 0,
          message: 'No more articles to format'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Formatting ${articles.length} articles`);

    // Process articles in smaller batches
    const batchSize = 10;
    let processed = 0;
    let errors = 0;
    const errorDetails: Array<{ id: string; post_id: number; error: string }> = [];

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      const updates = batch.map(async (article) => {
        try {
          const formattedContent = formatArticleContent(article.content);
          
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              content: formattedContent,
              updated_at: new Date().toISOString(),
            })
            .eq('id', article.id);

          if (updateError) {
            console.error(`Error updating article ${article.post_id}:`, updateError);
            errors++;
            errorDetails.push({
              id: article.id,
              post_id: article.post_id,
              error: updateError.message
            });
            return false;
          }

          processed++;
          console.log(`✓ Formatted article ${article.post_id}: ${article.title}`);
          return true;
        } catch (err) {
          console.error(`Error processing article ${article.post_id}:`, err);
          errors++;
          errorDetails.push({
            id: article.id,
            post_id: article.post_id,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
          return false;
        }
      });

      await Promise.all(updates);
    }

    console.log(`Chunk ${chunkIndex} complete. Processed: ${processed}, Errors: ${errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        hasMore: articles.length === chunkSize,
        processed,
        errors,
        errorDetails: errors > 0 ? errorDetails : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in format-all-articles:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

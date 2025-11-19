import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Article formatting function (matches frontend logic)
const formatArticleContent = (text?: string | null): string => {
  if (!text) return "";
  let cleaned = text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\r\n/g, "\n");

  // Convert markdown-style headings (**Heading**) on their own line to <h2>
  cleaned = cleaned.replace(/^\s*\*\*(.+?)\*\*\s*$/gm, "<h2>$1</h2>");

  // Convert remaining bold markers to <strong>
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  
  // Make question headers bold (lines ending with ?)
  cleaned = cleaned.replace(/^\s*([A-Z][^?\n]+\?)\s*$/gm, "<h2>$1</h2>");
  
  // Make title-case section headers bold
  cleaned = cleaned.replace(/^\s*([A-Z][A-Za-z\s]+(?:Prototypes|Features|Questions|Air|Dream)[A-Za-z\s]*)\s*$/gm, (match) => {
    if (match.includes('<h2>') || match.includes('<strong>')) return match;
    const capitalCount = (match.match(/[A-Z]/g) || []).length;
    if (capitalCount >= 3) {
      return `<h2>${match.trim()}</h2>`;
    }
    return match;
  });
  
  // Make numbered list headers bold ONLY
  cleaned = cleaned.replace(/^(\d+\.\s+[A-Z][A-Za-z\s\-]+)\s*$/gm, "<strong>$1</strong>");

  // Normalize multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove leading indentation
  cleaned = cleaned.replace(/^[ \t]+/gm, "").trim();

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => {
      if (/^<h[1-6]\b|^<ul\b|^<ol\b|^<li\b|^<p\b|^<hr\b/i.test(p)) {
        return p;
      }
      return `<p>${p}</p>`;
    })
    .join("\n");
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

    console.log('Starting article formatting process...');

    // Fetch all articles
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, post_id, content, title')
      .not('content', 'is', null);

    if (fetchError) {
      console.error('Error fetching articles:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${articles?.length || 0} articles to process`);

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No articles found to format',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process articles in batches of 10
    const batchSize = 10;
    let processed = 0;
    let errors = 0;
    const errorDetails: Array<{ id: string; post_id: number; error: string }> = [];

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(articles.length / batchSize)}`);

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
      
      // Small delay between batches to avoid overwhelming the database
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Formatting complete. Processed: ${processed}, Errors: ${errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Article formatting complete`,
        total: articles.length,
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

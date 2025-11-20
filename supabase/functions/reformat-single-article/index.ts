import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Article formatting function - Clean formatting without double-wrapping
const formatArticleContent = (text?: string | null): string => {
  if (!text) return "";
  
  // Clean up links, URLs, and unwanted markers
  let cleaned = text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    // CRITICAL: Remove existing HTML tags to prevent double-wrapping
    .replace(/<\/?p>/gi, "")
    .replace(/<\/?div>/gi, "")
    .replace(/<\/?span>/gi, "")
    .replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "") // Remove HTML lists
    .replace(/<li[^>]*>[\s\S]*?<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();

  // Split into paragraphs and wrap each in <p> tags
  const paragraphs = cleaned
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("\n\n");
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { articleId } = await req.json();

    if (!articleId) {
      throw new Error('Article ID is required');
    }

    // Fetch the article
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('id, content')
      .eq('id', articleId)
      .single();

    if (fetchError || !article) {
      throw new Error('Article not found');
    }

    // Format the content
    const formattedContent = formatArticleContent(article.content);

    // Update the article
    const { error: updateError } = await supabase
      .from('articles')
      .update({
        content: formattedContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', articleId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Article reformatted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

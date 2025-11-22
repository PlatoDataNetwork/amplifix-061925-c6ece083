import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Clean text by removing unwanted HTML and formatting
const cleanText = (text?: string | null): string => {
  if (!text) return "";
  
  return text
    // Remove Plato source links first
    .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
    .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
    .replace(/Source Link:[\s\S]*?<\/a>/gi, '')
    // Remove other HTML and formatting
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
    .replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "")
    .replace(/<li[^>]*>[\s\S]*?<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();
};

// Use AI to detect semantic breaks and split into paragraphs with headers
const formatArticleWithAI = async (text: string): Promise<string> => {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not found, falling back to simple formatting");
    return fallbackFormatting(text);
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert content formatter. Identify section headers - these are short topic titles (3-15 words) that introduce new sections, often at the start of major content blocks. Common patterns: 'The [Topic]', '[Topic]: [Subtitle]', '[Action/Concept] and [Action/Concept]'. Mark ALL section headers by prefixing with [HEADER]. Insert paragraph breaks at semantic boundaries. Return ONLY formatted text with [HEADER] markers."
          },
          {
            role: "user",
            content: `Identify ALL section headers in this article. Section headers are topic titles like "China Experiences Commercial Rocket Failure While Achieving Record-Breaking Annual Launch Count", "A Record-Breaking Year for Chinese Space Launches", "The Commercial Rocket Failure", "Balancing Success and Challenges". Prefix EVERY section header with [HEADER] and add paragraph breaks:\n\n${text}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("AI API error:", response.status, await response.text());
      return fallbackFormatting(text);
    }

    const data = await response.json();
    const formattedText = data.choices?.[0]?.message?.content || text;
    
    // Process blocks and wrap in appropriate tags
    const blocks = formattedText
      .split(/\n\n+/)
      .map((block: string) => block.trim())
      .filter(Boolean);

    return blocks.map((block: string) => {
      if (block.startsWith('[HEADER]')) {
        const headerText = block.replace('[HEADER]', '').trim();
        return `<h3>${headerText}</h3>`;
      }
      return `<p>${block}</p>`;
    }).join("\n\n");
  } catch (error) {
    console.error("Error using AI for formatting:", error);
    return fallbackFormatting(text);
  }
};

// Fallback formatting if AI is unavailable
const fallbackFormatting = (text: string): string => {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    currentParagraph.push(sentence);
    
    if (currentParagraph.length >= 3 && (i === sentences.length - 1 || Math.random() > 0.5)) {
      paragraphs.push(currentParagraph.join(" "));
      currentParagraph = [];
    }
  }
  
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  return paragraphs
    .filter(Boolean)
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

    // Verify user is authenticated and has admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('User authentication failed:', authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      console.error('Admin check failed:', roleError);
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin user authenticated:', user.id);

    const { articleId } = await req.json();

    if (!articleId) {
      throw new Error('Article ID is required');
    }

    console.log('Fetching article:', articleId);

    // Fetch the article
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('id, content')
      .eq('id', articleId)
      .single();

    if (fetchError || !article) {
      throw new Error('Article not found');
    }

    console.log('Cleaning and formatting article with AI...');

    // Clean and format the content with AI
    const cleanedText = cleanText(article.content);
    const formattedContent = await formatArticleWithAI(cleanedText);

    console.log('Updating article in database...');

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

    console.log('Article reformatted successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Article reformatted successfully with AI-powered semantic analysis'
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

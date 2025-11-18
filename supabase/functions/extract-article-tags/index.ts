import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractKeywords(text: string, title: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 
    'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 
    'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
    'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
    'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
    'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been'
  ]);

  // Combine title and content
  const fullText = `${title} ${text}`.toLowerCase();
  
  // Extract words
  const words = fullText
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Extract phrases (2-3 word combinations)
  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const twoWord = `${words[i]} ${words[i + 1]}`;
    if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
      phrases.push(twoWord);
    }
    
    if (i < words.length - 2) {
      const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1]) && !stopWords.has(words[i + 2])) {
        phrases.push(threeWord);
      }
    }
  }

  // Count phrase frequency
  const phraseCount = new Map<string, number>();
  phrases.forEach(phrase => {
    phraseCount.set(phrase, (phraseCount.get(phrase) || 0) + 1);
  });

  // Get top single words
  const topWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);

  // Get top phrases
  const topPhrases = Array.from(phraseCount.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase]) => phrase);

  // Combine and deduplicate
  const tags = [...new Set([...topPhrases, ...topWords])].slice(0, 10);
  
  return tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId } = await req.json();
    
    if (!articleId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Article ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the article
    const { data: article, error: fetchError } = await supabaseClient
      .from('articles')
      .select('id, title, content, excerpt')
      .eq('id', articleId)
      .single();

    if (fetchError || !article) {
      return new Response(
        JSON.stringify({ success: false, error: 'Article not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract keywords from content
    const content = article.content || article.excerpt || '';
    const tags = extractKeywords(content, article.title);

    console.log(`Extracted ${tags.length} tags for article ${articleId}:`, tags);

    // Store tags in database
    for (const tagName of tags) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
      
      // Create or get tag
      const { data: existingTag } = await supabaseClient
        .from('tags')
        .select('id')
        .eq('slug', tagSlug)
        .maybeSingle();

      let tagId: string;
      
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        const { data: newTag, error: tagError } = await supabaseClient
          .from('tags')
          .insert({ name: tagName, slug: tagSlug })
          .select('id')
          .single();
        
        if (tagError || !newTag) {
          console.error(`Failed to create tag ${tagName}:`, tagError);
          continue;
        }
        
        tagId = newTag.id;
      }

      // Link tag to article
      await supabaseClient
        .from('article_tags')
        .upsert({ article_id: article.id, tag_id: tagId }, { onConflict: 'article_id,tag_id' });
    }

    return new Response(
      JSON.stringify({ success: true, tags, articleId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in extract-article-tags function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
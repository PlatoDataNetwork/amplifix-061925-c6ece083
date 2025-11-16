import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const ACN_RSS_URL = 'https://www.acnnewswire.com/rss/lang/english.xml';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false },
      }
    );

    console.log(`Fetching ACN RSS from: ${ACN_RSS_URL}`);
    
    const response = await fetch(ACN_RSS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch ACN RSS: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    console.log(`Found ${items.length} items in RSS feed`);
    
    const articles = Array.from(items).map((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const author = item.querySelector('creator')?.textContent || 
                    item.querySelector('author')?.textContent || 
                    'ACN Newswire';
      const description = item.querySelector('description')?.textContent || '';
      const content = item.querySelector('encoded')?.textContent || description;
      
      const categoryElements = item.querySelectorAll('category');
      const categories: string[] = [];
      categoryElements.forEach((cat) => {
        const catText = cat.textContent;
        if (catText) categories.push(catText);
      });
      
      // Generate unique post_id from title and date
      const postId = Math.abs(
        (title + pubDate).split('').reduce((hash, char) => {
          return ((hash << 5) - hash) + char.charCodeAt(0);
        }, 0)
      ) % 1000000000;
      
      const pubDateObj = new Date(pubDate);
      const wordCount = content?.split(/\s+/).length || 0;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        post_id: postId,
        title,
        excerpt: 'ACN. Your Gateway to the Asian Capital Markets.',
        content: content || '',
        author,
        read_time: `${readTime} min read`,
        category: 'ACN',
        vertical_slug: 'acn',
        image_url: null,
        external_url: link,
        published_at: pubDateObj.toISOString(),
        metadata: {
          sourceLink: [link],
          categories,
        }
      };
    });

    console.log(`Transformed ${articles.length} articles`);

    // Upsert articles in batches of 100
    let insertedCount = 0;
    let errorCount = 0;
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await supabaseClient
        .from('articles')
        .upsert(batch, {
          onConflict: 'post_id',
          ignoreDuplicates: false
        })
        .select('id');

      if (error) {
        console.error(`Error in batch ${i / BATCH_SIZE + 1}:`, error);
        errorCount += batch.length;
      } else {
        insertedCount += data?.length || 0;
      }
    }

    const duration = Date.now() - startTime;
    const stats = {
      success: true,
      vertical: 'acn',
      totalArticles: articles.length,
      insertedArticles: insertedCount,
      errors: errorCount,
      duration
    };

    console.log('ACN import completed:', stats);

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ACN import error:', error);
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
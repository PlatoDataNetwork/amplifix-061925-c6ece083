import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlatoDataArticle {
  // ID fields (some use 'id', others use 'post_id')
  id?: number;
  post_id?: number;
  
  // Required fields
  title: string;
  content?: string;
  
  // Date fields (some use 'date', others use 'published_at')
  date?: string;
  published_at?: string;
  
  // Optional fields
  excerpt?: string;
  author?: string;
  image_url?: string;
  external_url?: string;
  tags?: string[];
  slug?: string;
  source?: string;
  categories?: string[];
}

// Normalize article fields to check compatibility
function normalizeArticle(article: any): {
  hasId: boolean;
  hasTitle: boolean;
  hasContent: boolean;
  hasDate: boolean;
  mappedPostId: number | undefined;
  mappedDate: string | undefined;
} {
  return {
    hasId: !!(article.post_id || article.id),
    hasTitle: !!article.title,
    hasContent: !!article.content,
    hasDate: !!(article.published_at || article.date),
    mappedPostId: article.post_id || article.id,
    mappedDate: article.published_at || article.date,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching cannabis feed from PlatoData...');
    
    const response = await fetch('https://platodata.ai/cannabis/json/');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('Raw response type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    
    // Handle both array and object responses
    let articles: PlatoDataArticle[];
    let metadata: any = null;
    
    if (Array.isArray(data)) {
      articles = data;
    } else if (data && typeof data === 'object') {
      // Check if it's wrapped in an object with articles key
      if (data.articles && Array.isArray(data.articles)) {
        articles = data.articles;
        metadata = { ...data };
        delete metadata.articles;
      } else if (data.posts && Array.isArray(data.posts)) {
        articles = data.posts;
        metadata = { ...data };
        delete metadata.posts;
      } else {
        // Return the structure for analysis
        return new Response(JSON.stringify({
          status: 'UNKNOWN_STRUCTURE',
          message: 'Response is not an array',
          responseType: typeof data,
          isArray: Array.isArray(data),
          keys: Object.keys(data),
          sampleData: data,
        }, null, 2), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      throw new Error('Unexpected response format');
    }
    
    console.log(`Fetched ${articles.length} articles`);
    
    // Validate structure
    const validation = {
      totalArticles: articles.length,
      isArray: Array.isArray(articles),
      sampleArticle: articles[0],
      structureCheck: normalizeArticle(articles[0] || {}),
      missingFields: [] as string[],
      validArticles: 0,
      invalidArticles: [] as any[],
    };

    // Check all articles for required fields using field mapping
    articles.forEach((article, index) => {
      const normalized = normalizeArticle(article);
      const missing = [];
      
      if (!normalized.hasId) missing.push('id/post_id');
      if (!normalized.hasTitle) missing.push('title');
      if (!normalized.hasDate) missing.push('date/published_at');
      
      if (missing.length > 0) {
        validation.invalidArticles.push({
          index,
          article: article,
          missingFields: missing,
          normalized: normalized,
        });
      } else {
        validation.validArticles++;
      }
    });

    // Get unique field keys from first 10 articles
    const fieldSample = articles.slice(0, 10).map(article => Object.keys(article));
    const allFields = [...new Set(fieldSample.flat())];

    return new Response(JSON.stringify({
      ...validation,
      metadata,
      allFieldsFound: allFields,
      fieldMappingNote: "Import function now handles id→post_id and date→published_at mapping",
      status: validation.validArticles === articles.length ? 'PASS' : 'FAIL',
      message: validation.validArticles === articles.length 
        ? '✅ All articles are compatible with import (using field mapping)'
        : `❌ ${validation.invalidArticles.length} articles are missing required fields`,
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error testing cannabis feed:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'ERROR',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

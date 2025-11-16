# Scaling Strategy for 400K+ Articles

## Current Architecture Issues

### 1. **Client-Side Data Loading**
- ❌ All articles loaded in memory at once
- ❌ No pagination on API level
- ❌ Frontend filtering causes performance issues
- ❌ Images loaded without optimization

### 2. **Database Requirements**
Currently using external APIs (platodata.io, RSS feeds). For 400K articles, need:
- ✅ Supabase database for centralized storage
- ✅ Proper indexing on key fields
- ✅ Full-text search capabilities
- ✅ Efficient query pagination

---

## Recommended Architecture

### Phase 1: Database Setup (CRITICAL)

#### A. Create Articles Table
```sql
-- Main articles table with proper indexing
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id BIGINT UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  read_time TEXT,
  category TEXT,
  vertical_slug TEXT NOT NULL,
  image_url TEXT,
  external_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical indexes for performance
CREATE INDEX idx_articles_vertical ON articles(vertical_slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_post_id ON articles(post_id);

-- Full-text search index
CREATE INDEX idx_articles_search ON articles USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, ''))
);

-- Composite index for common query patterns
CREATE INDEX idx_articles_vertical_published ON articles(vertical_slug, published_at DESC);
```

#### B. Tags Table (Many-to-Many)
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_article ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);
```

#### C. Enable RLS (Row Level Security)
```sql
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Public read access (articles are public content)
CREATE POLICY "Articles are viewable by everyone" 
ON articles FOR SELECT 
USING (true);

CREATE POLICY "Tags are viewable by everyone" 
ON tags FOR SELECT 
USING (true);

CREATE POLICY "Article tags are viewable by everyone" 
ON article_tags FOR SELECT 
USING (true);
```

---

### Phase 2: Image Optimization

#### A. Use CDN for Images
- Store original images in Supabase Storage
- Use Supabase's built-in CDN transforms
- Generate responsive image sizes:
  ```
  thumbnail: 400x300
  medium: 800x600
  large: 1200x900
  ```

#### B. Implement Progressive Loading
```typescript
// Use blur placeholder
<img 
  src={thumbnailUrl}
  srcSet={`${thumbnailUrl} 400w, ${mediumUrl} 800w, ${largeUrl} 1200w`}
  sizes="(max-width: 768px) 400px, 800px"
  loading="lazy"
  decoding="async"
/>
```

---

### Phase 3: API Optimization

#### A. Implement Server-Side Pagination
Create Edge Function: `get-articles`

```typescript
// supabase/functions/get-articles/index.ts
import { createClient } from '@supabase/supabase-js'

interface ArticleQuery {
  vertical?: string
  category?: string
  tag?: string
  search?: string
  page?: number
  limit?: number
}

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const url = new URL(req.url)
  const vertical = url.searchParams.get('vertical')
  const category = url.searchParams.get('category')
  const tag = url.searchParams.get('tag')
  const search = url.searchParams.get('search')
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '12')
  
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('articles')
    .select('*, article_tags(tags(name, slug))', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  // Apply filters
  if (vertical) query = query.eq('vertical_slug', vertical)
  if (category) query = query.eq('category', category)
  if (search) {
    query = query.textSearch('title', search, { type: 'websearch' })
  }

  const { data, error, count } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    articles: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: to < (count || 0) - 1
    }
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300' // 5 min cache
    }
  })
})
```

---

### Phase 4: Frontend Implementation

#### A. Update Hook to Use Paginated API
```typescript
// src/hooks/usePaginatedArticles.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsePaginatedArticlesOptions {
  vertical?: string;
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
}

export function usePaginatedArticles(options: UsePaginatedArticlesOptions) {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [page, options.vertical, options.category, options.tag, options.search]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: (options.limit || 12).toString(),
        ...(options.vertical && { vertical: options.vertical }),
        ...(options.category && { category: options.category }),
        ...(options.tag && { tag: options.tag }),
        ...(options.search && { search: options.search }),
      });

      const { data, error } = await supabase.functions.invoke('get-articles', {
        body: Object.fromEntries(params)
      });

      if (error) throw error;

      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }

      setHasMore(data.pagination.hasMore);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  const reset = () => {
    setPage(1);
    setArticles([]);
  };

  return {
    articles,
    isLoading,
    error,
    hasMore,
    totalPages,
    currentPage: page,
    loadMore,
    reset
  };
}
```

#### B. Implement Infinite Scroll
```typescript
// src/components/InfiniteScrollTrigger.tsx
import { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function InfiniteScrollTrigger({ 
  onIntersect, 
  isLoading, 
  hasMore 
}: InfiniteScrollTriggerProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onIntersect]);

  if (!hasMore) return null;

  return (
    <div ref={elementRef} className="py-8 flex justify-center">
      {isLoading && <div className="animate-spin">Loading...</div>}
    </div>
  );
}
```

---

### Phase 5: Caching Strategy

#### A. API Response Caching
```typescript
// Edge Function with caching
const CACHE_TTL = 300; // 5 minutes

return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=600`
  }
});
```

#### B. Client-Side Caching with React Query
```typescript
// src/hooks/useCachedArticles.ts
import { useQuery } from '@tanstack/react-query';

export function useCachedArticles(vertical: string) {
  return useQuery({
    queryKey: ['articles', vertical],
    queryFn: () => fetchArticles(vertical),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
```

---

### Phase 6: Search Optimization

#### A. Implement Full-Text Search
```sql
-- Create search function
CREATE OR REPLACE FUNCTION search_articles(
  search_query TEXT,
  vertical_filter TEXT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  excerpt TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.excerpt,
    ts_rank(
      to_tsvector('english', a.title || ' ' || COALESCE(a.excerpt, '') || ' ' || COALESCE(a.content, '')),
      websearch_to_tsquery('english', search_query)
    ) as rank
  FROM articles a
  WHERE 
    to_tsvector('english', a.title || ' ' || COALESCE(a.excerpt, '') || ' ' || COALESCE(a.content, ''))
    @@ websearch_to_tsquery('english', search_query)
    AND (vertical_filter IS NULL OR a.vertical_slug = vertical_filter)
  ORDER BY rank DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

---

### Phase 7: Data Import Strategy

#### A. Create Import Edge Function
```typescript
// supabase/functions/import-articles/index.ts
import { createClient } from '@supabase/supabase-js'

const BATCH_SIZE = 100;

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { vertical, start = 0 } = await req.json();

  // Fetch from external API
  const response = await fetch(`https://dashboard.platodata.io/json/${vertical}.json`);
  const data = await response.json();
  const articles = data.articles || [];

  // Process in batches
  const batches = [];
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE).map(article => ({
      post_id: article.post_id,
      title: article.title,
      content: article.content,
      excerpt: article.content?.substring(0, 200),
      author: 'PlatoData',
      published_at: article.date,
      vertical_slug: vertical,
      image_url: article.metadata?.featuredImage?.[0] || null,
      external_url: article.metadata?.sourceLink?.[0] || null,
      metadata: article.metadata
    }));

    const { error } = await supabase
      .from('articles')
      .upsert(batch, { onConflict: 'post_id' });

    if (error) {
      console.error('Batch error:', error);
    }

    batches.push({ processed: batch.length });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    processed: articles.length,
    batches: batches.length
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## Performance Benchmarks

### Target Metrics
- **Initial Load**: < 2 seconds (first 12 articles)
- **Scroll Load**: < 500ms (next 12 articles)
- **Search Results**: < 1 second
- **Image Load**: < 200ms (with CDN)
- **Memory Usage**: < 100MB (client-side)

### Database Performance
- **Query Time**: < 50ms (with proper indexes)
- **Full-Text Search**: < 200ms (indexed)
- **Pagination**: O(1) with cursor-based pagination

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Create database schema
- [ ] Set up indexes and RLS
- [ ] Create import edge function
- [ ] Import initial dataset (test with 10K articles)

### Week 2: API Layer
- [ ] Build paginated API endpoint
- [ ] Implement caching strategy
- [ ] Add search functionality
- [ ] Performance testing

### Week 3: Frontend
- [ ] Update hooks to use new API
- [ ] Implement infinite scroll
- [ ] Add search UI
- [ ] Optimize image loading

### Week 4: Optimization
- [ ] CDN setup for images
- [ ] Query optimization
- [ ] Load testing with 400K articles
- [ ] Performance monitoring setup

### Week 5: Migration
- [ ] Full data import
- [ ] Validation and testing
- [ ] Gradual rollout
- [ ] Monitor and optimize

---

## Cost Estimation (400K Articles)

### Storage
- **Articles Data**: ~20GB (50KB avg per article)
- **Images**: ~100GB (250KB avg, assuming not all have images)
- **Total Storage**: ~120GB

### Database
- **Supabase Pro**: $25/month (8GB included, $0.125/GB extra)
- **Extra Storage**: ~112GB × $0.125 = $14/month
- **Total DB Cost**: ~$39/month

### Bandwidth
- **Monthly Views**: Estimate based on traffic
- **CDN Bandwidth**: Supabase includes 50GB, then $0.09/GB

### Total Estimated Cost
- **Conservative**: $50-100/month
- **High Traffic**: $200-300/month

---

## Monitoring & Maintenance

### Key Metrics to Track
1. API response times
2. Database query performance
3. Cache hit rates
4. Image load times
5. Error rates
6. User engagement (scroll depth, click-through)

### Tools
- Supabase Dashboard (query analysis)
- Vercel Analytics (performance)
- Custom logging in Edge Functions
- Regular index maintenance

---

## Security Considerations

1. **Rate Limiting**: Implement on Edge Functions
2. **Input Validation**: Sanitize all query parameters
3. **API Keys**: Store securely in Supabase secrets
4. **Content Moderation**: Filter inappropriate content
5. **CORS**: Configure properly for production domain
6. **SQL Injection**: Use parameterized queries always

---

## Next Steps

1. Review and approve architecture
2. Create database migration
3. Deploy import function
4. Test with sample data
5. Monitor and iterate

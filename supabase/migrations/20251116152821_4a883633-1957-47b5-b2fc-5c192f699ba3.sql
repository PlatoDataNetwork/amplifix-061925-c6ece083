-- Create articles table with proper structure for 400K+ articles
CREATE TABLE IF NOT EXISTS public.articles (
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

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Create indexes for optimal query performance

-- Single column indexes
CREATE INDEX IF NOT EXISTS idx_articles_vertical ON public.articles(vertical_slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_post_id ON public.articles(post_id);

-- Composite index for common query pattern (vertical + date)
CREATE INDEX IF NOT EXISTS idx_articles_vertical_published ON public.articles(vertical_slug, published_at DESC);

-- Full-text search index for title, excerpt, and content
CREATE INDEX IF NOT EXISTS idx_articles_search ON public.articles 
USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- Indexes for article_tags junction table
CREATE INDEX IF NOT EXISTS idx_article_tags_article ON public.article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON public.article_tags(tag_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (articles are public content)
CREATE POLICY "Articles are viewable by everyone" 
ON public.articles 
FOR SELECT 
USING (true);

CREATE POLICY "Tags are viewable by everyone" 
ON public.tags 
FOR SELECT 
USING (true);

CREATE POLICY "Article tags are viewable by everyone" 
ON public.article_tags 
FOR SELECT 
USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create helper function for full-text search
CREATE OR REPLACE FUNCTION public.search_articles(
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
) 
LANGUAGE plpgsql
STABLE
AS $$
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
  FROM public.articles a
  WHERE 
    to_tsvector('english', a.title || ' ' || COALESCE(a.excerpt, '') || ' ' || COALESCE(a.content, ''))
    @@ websearch_to_tsquery('english', search_query)
    AND (vertical_filter IS NULL OR a.vertical_slug = vertical_filter)
  ORDER BY rank DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;
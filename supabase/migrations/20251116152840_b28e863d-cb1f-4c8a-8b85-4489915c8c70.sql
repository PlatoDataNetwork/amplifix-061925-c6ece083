-- Update search function with proper security settings
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
SECURITY DEFINER
SET search_path = public
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
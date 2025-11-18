-- Create a function to get article counts per vertical
CREATE OR REPLACE FUNCTION public.get_vertical_article_counts()
RETURNS TABLE(vertical_slug text, article_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    vertical_slug,
    COUNT(*) as article_count
  FROM public.articles
  GROUP BY vertical_slug
  ORDER BY article_count DESC;
$$;
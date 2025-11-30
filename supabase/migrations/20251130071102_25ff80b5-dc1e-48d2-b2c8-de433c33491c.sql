-- Drop existing function and recreate with size calculation
DROP FUNCTION IF EXISTS public.get_backup_summary();

CREATE FUNCTION public.get_backup_summary()
RETURNS TABLE (
  backup_name text,
  backup_description text,
  created_at timestamp with time zone,
  article_count bigint,
  size_bytes bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    backup_name,
    MAX(backup_description) as backup_description,
    MIN(created_at) as created_at,
    COUNT(*) as article_count,
    SUM(
      COALESCE(pg_column_size(title), 0) +
      COALESCE(pg_column_size(content), 0) +
      COALESCE(pg_column_size(excerpt), 0) +
      COALESCE(pg_column_size(author), 0) +
      COALESCE(pg_column_size(image_url), 0) +
      COALESCE(pg_column_size(metadata), 0)
    ) as size_bytes
  FROM public.article_backups
  GROUP BY backup_name
  ORDER BY MIN(created_at) DESC;
$$;
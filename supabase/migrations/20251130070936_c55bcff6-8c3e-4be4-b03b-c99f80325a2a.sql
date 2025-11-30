-- Create function to efficiently get backup summaries
CREATE OR REPLACE FUNCTION public.get_backup_summary()
RETURNS TABLE (
  backup_name text,
  backup_description text,
  created_at timestamp with time zone,
  article_count bigint
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
    COUNT(*) as article_count
  FROM public.article_backups
  GROUP BY backup_name
  ORDER BY MIN(created_at) DESC;
$$;
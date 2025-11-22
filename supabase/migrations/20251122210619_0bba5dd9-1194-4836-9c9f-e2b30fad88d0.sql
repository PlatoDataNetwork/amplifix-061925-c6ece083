-- Ensure realtime works for article inserts so the ImportAdmin live stats update

-- 1) Make sure the articles table publishes full row data for updates/inserts
ALTER TABLE public.articles REPLICA IDENTITY FULL;

-- 2) Add the articles table to the supabase_realtime publication if it is not already there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'articles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
  END IF;
END;
$$;
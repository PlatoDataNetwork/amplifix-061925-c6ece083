-- Enable realtime for public.articles so client can track per-article inserts
DO $$
BEGIN
  -- Ensure REPLICA IDENTITY FULL for complete row data
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'articles'
      AND n.nspname = 'public'
      AND c.relreplident <> 'f'
  ) THEN
    EXECUTE 'ALTER TABLE public.articles REPLICA IDENTITY FULL';
  END IF;

  -- Add articles table to supabase_realtime publication if not already present
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'articles'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.articles';
  END IF;
END $$;
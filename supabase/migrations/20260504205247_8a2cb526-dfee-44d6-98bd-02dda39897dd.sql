-- Remove admin-only tables from the Realtime publication so row changes are not broadcast.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'article_backups'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.article_backups';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'import_history'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.import_history';
  END IF;
END $$;

-- Add RLS policies on realtime.messages to restrict channel subscriptions to authenticated users only.
-- This prevents anonymous subscribers from listening on any channel.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'realtime' AND tablename = 'messages') THEN
    -- Drop existing policies if present, then recreate
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can read realtime messages" ON realtime.messages';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can write realtime messages" ON realtime.messages';

    EXECUTE $p$
      CREATE POLICY "Authenticated users can read realtime messages"
      ON realtime.messages
      FOR SELECT
      TO authenticated
      USING (true)
    $p$;

    EXECUTE $p$
      CREATE POLICY "Authenticated users can write realtime messages"
      ON realtime.messages
      FOR INSERT
      TO authenticated
      WITH CHECK (true)
    $p$;
  END IF;
END $$;
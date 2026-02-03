-- Drop the overly permissive service role policies
DROP POLICY IF EXISTS "Service role can insert sync logs" ON public.feed_sync_logs;
DROP POLICY IF EXISTS "Service role can update feeds" ON public.rss_feeds;

-- The service role key bypasses RLS by default, so we don't need explicit policies for it.
-- Edge functions using service role will automatically bypass RLS.
-- The admin-only policies are sufficient for authenticated users.
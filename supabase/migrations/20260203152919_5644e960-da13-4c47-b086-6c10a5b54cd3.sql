-- Enable pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule auto-sync feeds to run every hour
SELECT cron.schedule(
  'auto-sync-feeds-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
      url := 'https://rfkdcmvzvxcsoecoeddi.supabase.co/functions/v1/auto-sync-feeds',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os"}'::jsonb,
      body := concat('{"time": "', now(), '"}')::jsonb
    ) AS request_id;
  $$
);
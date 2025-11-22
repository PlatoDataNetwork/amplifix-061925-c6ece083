-- Enable auto-resume functionality for imports
-- This cron job checks every 2 minutes for imports that need resuming and automatically continues them

SELECT cron.schedule(
  'auto-resume-imports',
  '*/2 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://rfkdcmvzvxcsoecoeddi.supabase.co/functions/v1/auto-resume-imports',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2RjbXZ6dnhjc29lY29lZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzU5NjcsImV4cCI6MjA3MzAxMTk2N30.Qaom06rLiekLwBWb15giAbkpEr_r0xzdyEsslcA86os"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) AS request_id;
  $$
);
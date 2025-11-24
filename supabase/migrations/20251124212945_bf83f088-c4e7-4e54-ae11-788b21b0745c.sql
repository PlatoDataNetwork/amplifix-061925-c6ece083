-- Cancel all in-progress aviation imports by marking them as failed
UPDATE import_history 
SET 
  status = 'failed',
  cancelled = true,
  completed_at = NOW(),
  duration_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000,
  metadata = metadata::jsonb || jsonb_build_object('cancelled_reason', 'Stopped to prioritize AI processing')
WHERE vertical_slug = 'aviation' 
  AND status IN ('in_progress', 'partial');
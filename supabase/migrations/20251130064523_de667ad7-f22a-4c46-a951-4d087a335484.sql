-- Mark all in-progress AI processing jobs as failed so UI no longer shows them as running
UPDATE public.ai_processing_jobs
SET status = 'failed',
    completed_at = now(),
    updated_at = now()
WHERE status = 'in_progress';
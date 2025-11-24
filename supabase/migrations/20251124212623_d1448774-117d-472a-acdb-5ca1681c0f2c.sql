-- Create AI processing job for aviation articles
INSERT INTO ai_processing_jobs (vertical_slug, total_chunks, status, started_at)
VALUES ('aviation', 126, 'in_progress', NOW())
RETURNING id;
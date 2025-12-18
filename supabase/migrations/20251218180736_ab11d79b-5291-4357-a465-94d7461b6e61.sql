-- Cancel all in-progress AR/VR imports by marking them as failed with cancelled flag
UPDATE import_history 
SET cancelled = true, status = 'failed', completed_at = now()
WHERE vertical_slug = 'ar-vr' AND status = 'in_progress';
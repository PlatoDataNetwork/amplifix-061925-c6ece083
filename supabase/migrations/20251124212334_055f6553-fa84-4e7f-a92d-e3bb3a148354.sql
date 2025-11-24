-- Mark the completed aviation import as finished
UPDATE import_history 
SET 
  status = 'completed',
  completed_at = NOW(),
  duration_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000,
  metadata = metadata::jsonb || jsonb_build_object('completed', true, 'finalPage', 670)
WHERE id = 'ab06cd46-e506-43b7-a701-35ff29668d3a';
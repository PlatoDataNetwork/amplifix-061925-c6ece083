-- Update the stuck aviation import to be resumable
UPDATE import_history 
SET 
  status = 'partial',
  metadata = jsonb_set(
    metadata::jsonb,
    '{nextPage}',
    '171'
  ) || jsonb_build_object('resumable', true, 'note', 'Ready to resume from page 171')
WHERE id = 'ab06cd46-e506-43b7-a701-35ff29668d3a';
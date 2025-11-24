-- Increase file size limit for showcase-videos bucket to 500MB
UPDATE storage.buckets 
SET file_size_limit = 524288000
WHERE id = 'showcase-videos';
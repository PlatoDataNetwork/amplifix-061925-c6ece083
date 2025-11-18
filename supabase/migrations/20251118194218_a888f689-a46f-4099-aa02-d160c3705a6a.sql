-- Remove ** from article titles, excerpts, and content
UPDATE articles
SET 
  title = REPLACE(title, '**', ''),
  excerpt = REPLACE(excerpt, '**', ''),
  content = REPLACE(content, '**', '')
WHERE title LIKE '%**%' 
   OR excerpt LIKE '%**%' 
   OR content LIKE '%**%';
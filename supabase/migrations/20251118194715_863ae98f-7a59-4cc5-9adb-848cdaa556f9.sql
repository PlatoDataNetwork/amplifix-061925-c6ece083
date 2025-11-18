-- Remove markdown artifacts (** , * , ---) from all article fields
UPDATE articles
SET 
  title = REPLACE(REPLACE(title, '---', ''), '*', ''),
  excerpt = REPLACE(REPLACE(excerpt, '---', ''), '*', ''),
  content = REPLACE(REPLACE(content, '---', ''), '*', '')
WHERE title LIKE '%*%' 
   OR title LIKE '%---%'
   OR excerpt LIKE '%*%'
   OR excerpt LIKE '%---%'
   OR content LIKE '%*%'
   OR content LIKE '%---%';
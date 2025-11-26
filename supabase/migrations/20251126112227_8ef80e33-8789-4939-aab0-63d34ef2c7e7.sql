-- Remove source attribution from all automotive articles
UPDATE articles 
SET content = REGEXP_REPLACE(
  content,
  '<div[^>]*style="[^"]*margin-top:[^"]*"[^>]*>[\s\S]*?Plato Data Intelligence[\s\S]*?</div>\s*$',
  '',
  'gi'
)
WHERE vertical_slug = 'automotive' 
  AND content IS NOT NULL 
  AND content LIKE '%Plato Data Intelligence%';
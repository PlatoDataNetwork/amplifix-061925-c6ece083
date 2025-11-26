-- Remove plain text source attribution from automotive articles
UPDATE articles 
SET content = REGEXP_REPLACE(
  content,
  'Plato Data Intelligence:\s*PlatoAiStream\s*$',
  '',
  'gi'
)
WHERE vertical_slug = 'automotive' 
  AND content IS NOT NULL 
  AND content LIKE '%Plato Data Intelligence%';
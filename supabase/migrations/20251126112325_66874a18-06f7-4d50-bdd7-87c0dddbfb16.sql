-- Remove all variations of Plato attribution from automotive articles
UPDATE articles 
SET content = REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      content,
      '<p>\s*Plato Data Intelligence:\s*PlatoAiStream\s*</p>',
      '',
      'gi'
    ),
    'Plato Data Intelligence:\s*PlatoAiStream\s*</p>',
    '</p>',
    'gi'
  ),
  'Plato Data Intelligence:\s*PlatoAiStream',
  '',
  'gi'
)
WHERE vertical_slug = 'automotive' 
  AND content IS NOT NULL 
  AND content LIKE '%Plato Data Intelligence%';
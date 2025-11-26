-- Add source attribution to all AR/VR articles that don't have it
UPDATE articles 
SET content = content || '

<div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid rgba(229, 231, 235, 0.5);">
  <p style="margin: 0; font-size: 0.875rem; line-height: 1.5;">
    <span style="color: rgba(255, 255, 255, 0.7);">Source: </span>
    <a href="https://plato.io" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Plato Data Intelligence</a>
  </p>
</div>'
WHERE vertical_slug = 'ar-vr' 
  AND content IS NOT NULL 
  AND content NOT LIKE '%Plato Data Intelligence%';
UPDATE showcase_companies 
SET subtitle = CASE company_name
  WHEN 'SILO Pharma Inc.' THEN 'Psychedelic Medicine Development'
  WHEN 'Int''l Land Alliance' THEN 'Strategic Land Development'
  WHEN 'Synbio Int''l' THEN 'AI-Powered Diagnostic Solutions'
  WHEN 'DevvStream Corp' THEN 'Carbon Credit Generation'
END
WHERE company_name IN ('SILO Pharma Inc.', 'Int''l Land Alliance', 'Synbio Int''l', 'DevvStream Corp');
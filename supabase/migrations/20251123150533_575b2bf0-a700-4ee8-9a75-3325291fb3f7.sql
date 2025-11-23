-- Add main_sector column to showcase_companies table
ALTER TABLE showcase_companies ADD COLUMN IF NOT EXISTS main_sector TEXT;

-- Update main sectors for all companies
UPDATE showcase_companies SET main_sector = 'Telehealth' WHERE company_name = 'VSee Health';
UPDATE showcase_companies SET main_sector = 'WEB3' WHERE company_name = 'FAIM';
UPDATE showcase_companies SET main_sector = 'AI' WHERE company_name = 'ForexGPT';
UPDATE showcase_companies SET main_sector = 'CARBON' WHERE company_name = 'CUT';
UPDATE showcase_companies SET main_sector = 'CARBON' WHERE company_name = 'DevvStream Corp';
UPDATE showcase_companies SET main_sector = 'REAL ESTATE' WHERE company_name = 'Int''l Land Alliance';
UPDATE showcase_companies SET main_sector = 'PSYCHEDELICS' WHERE company_name = 'SILO Pharma Inc.';
UPDATE showcase_companies SET main_sector = 'AI, FACIAL ANALYSIS' WHERE company_name = 'Synbio Int''l';
UPDATE showcase_companies SET main_sector = 'CYBERSECURITY' WHERE company_name = 'Abatis';
UPDATE showcase_companies SET main_sector = 'AI, FACIAL ANALYSIS' WHERE company_name = 'FacialDX';
UPDATE showcase_companies SET main_sector = 'CYBERSECURITY' WHERE company_name = 'Naoris Protocol';
UPDATE showcase_companies SET main_sector = 'CARBON' WHERE company_name = 'Karbon-X';
UPDATE showcase_companies SET main_sector = 'ROBOTICS' WHERE company_name = 'Micropolis';
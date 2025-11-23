-- Update Naoris Protocol tags: remove Crypto, add AI, Blockchain, Cyber
UPDATE showcase_companies 
SET tags = ARRAY['AI', 'Blockchain', 'Cyber']
WHERE company_name = 'Naoris Protocol';
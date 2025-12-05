UPDATE showcase_companies 
SET tags = ARRAY['Real Estate Investment', 'Storage'],
    description = 'Leading real estate fund and management company specializing in storage facilities and commercial properties across strategic locations.'
WHERE company_name = 'StorageBlue';
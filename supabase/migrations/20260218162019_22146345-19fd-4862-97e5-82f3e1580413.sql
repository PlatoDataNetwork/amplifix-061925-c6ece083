-- Move OpenWorld to top
UPDATE showcase_companies SET display_order = -1 WHERE company_name = 'OpenWorld';

-- Move Bioxytran to I-ON Digital's position (104)
UPDATE showcase_companies SET display_order = 104 WHERE company_name = 'Bioxytran';

-- Shift I-ON Digital to Bioxytran's old position (0 -> use 105 to keep it after)
UPDATE showcase_companies SET display_order = 105 WHERE company_name = 'I-ON Digital';
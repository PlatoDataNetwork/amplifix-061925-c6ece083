-- Update VSee Health button text from "View on AmplifiX" to "Visit Showcase"
UPDATE showcase_companies
SET button_text = 'Visit Showcase'
WHERE company_name = 'VSee Health';
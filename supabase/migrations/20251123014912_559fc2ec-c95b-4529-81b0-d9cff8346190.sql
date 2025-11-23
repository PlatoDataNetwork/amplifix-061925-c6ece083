-- Add Forex-GPT.ai to showcase companies
INSERT INTO showcase_companies (
  company_name,
  description,
  subtitle,
  link,
  button_text,
  type,
  display_order,
  thumbnail,
  tags,
  website,
  disabled
) VALUES (
  'Forex-GPT.ai',
  'Advanced AI-powered forex trading analysis platform leveraging GPT-4o mini to deliver real-time technical analysis, trading signals, and sentiment scores across 120+ assets and 22 timeframes.',
  'AI-Powered Forex Trading Intelligence',
  '/showcase/forex-gpt',
  'Explore Platform',
  'fintech',
  11,
  '/lovable-uploads/forex-gpt-thumbnail.png',
  ARRAY['AI Trading', 'Forex Analysis', 'Technical Analysis', 'Trading Signals', 'GPT-4', 'Sentiment Score', 'FinTech'],
  'https://forex-gpt.ai/',
  false
);
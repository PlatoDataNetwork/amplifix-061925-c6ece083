-- Create showcase_companies table
CREATE TABLE public.showcase_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  ticker TEXT,
  subtitle TEXT,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  button_text TEXT NOT NULL DEFAULT 'View Showcase',
  link TEXT NOT NULL,
  website TEXT,
  stock_url TEXT,
  search_url TEXT,
  thumbnail TEXT,
  type TEXT NOT NULL DEFAULT 'stock',
  disabled BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.showcase_companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Showcase companies are viewable by everyone"
  ON public.showcase_companies
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage showcase companies"
  ON public.showcase_companies
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for company thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('showcase-thumbnails', 'showcase-thumbnails', true);

-- Create storage policies
CREATE POLICY "Showcase thumbnails are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'showcase-thumbnails');

CREATE POLICY "Admins can upload showcase thumbnails"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'showcase-thumbnails' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update showcase thumbnails"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'showcase-thumbnails' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete showcase thumbnails"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'showcase-thumbnails' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- Create trigger for updated_at
CREATE TRIGGER update_showcase_companies_updated_at
  BEFORE UPDATE ON public.showcase_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing showcase data
INSERT INTO public.showcase_companies (
  company_name, ticker, description, tags, button_text, link, website, stock_url, search_url, thumbnail, type, disabled, display_order
) VALUES
  ('SILO Pharma Inc.', 'NASDAQ: SILO', 'Pioneering neuropsychiatric drug development through AI-driven research and innovative therapeutic approaches for mental health conditions.', 
   ARRAY['Pharmaceutical', 'Biotech', 'CNS Therapeutics'], 'Visit Showcase', '/showcase/silo-pharma', 'https://silopharma.com/', 
   'https://www.tradingview.com/symbols/NASDAQ-SILO/', NULL, '/lovable-uploads/4fc4b91a-cd33-4009-ad3a-df4b3d33d179.png', 'stock', false, 1),
  
  ('Int''l Land Alliance', 'OTCQB: ILAL', 'International Land Alliance is a land investment and development company focused on acquiring and developing strategic real estate properties.', 
   ARRAY['Real Estate', 'Land Development', 'Investment'], 'View Showcase', '/showcase/international-land-alliance', 'https://www.internationallandalliance.com/', 
   'https://www.tradingview.com/symbols/OTC-ILAL/', NULL, '/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png', 'stock', false, 2),
  
  ('Karbon-X', 'OTCMKTS: KARX', 'Karbon-X is a technology company focused on innovative solutions and carbon management technologies to address environmental challenges.', 
   ARRAY['Technology', 'Environmental', 'Carbon Management'], 'View Showcase', '/showcase/karbon-x', 'https://www.karbon-x.com/', 
   'https://www.tradingview.com/symbols/OTC-KARX/', NULL, '/lovable-uploads/karbonx-icon.png', 'stock', false, 3),
  
  ('Micropolis', 'NYSE-AMEX: MCRP', 'Micropolis leverages breakthrough AI to deliver exquisite custom design bespoke robotic solutions, pioneering the future of autonomous mobile robotics.', 
   ARRAY['AI', 'Robotics', 'Autonomous Systems'], 'View Showcase', '/showcase/micropolis', 'https://www.micropolis.ai/', 
   'https://finance.yahoo.com/quote/MCRP/', 'https://www.bing.com/copilotsearch?q=Micropolis%20MCRP', '/lovable-uploads/micropolis-m-icon.png', 'stock', false, 4),
  
  ('Synbio Int''l', 'OTC: SYIN', 'Synbio International is a biotechnology research company focused on developing innovative probiotic solutions to enhance health and wellness through advanced life sciences.', 
   ARRAY['AI Health Diagnostics', 'AI Diagnostics', 'Probiotics'], 'View Showcase', '/showcase/synbio', 'https://www.synbiointl.com/', 
   'https://www.tradingview.com/symbols/OTC-SYIN/', 'https://www.bing.com/copilotsearch?q=Synbio%20International%20SYIN', '/lovable-uploads/synbio-social-thumbnail.png', 'stock', false, 5),
  
  ('Naoris Protocol', 'Crypto', 'Naoris Protocol is a decentralized cybersecurity platform leveraging blockchain technology to create a distributed, validator-based security mesh network.', 
   ARRAY['Blockchain', 'Cybersecurity', 'DeFi'], 'View Showcase', 'https://naorisprotocol.com', 'https://www.naorisprotocol.com/', 
   'https://coinmarketcap.com/currencies/naoris-protocol/', NULL, '/lovable-uploads/naoris-icon.png', 'token', false, 6),
  
  ('Abatis', 'ABTU Token', 'The first autonomous cybersecurity solution for Web3 products and users, delivering sovereignty & immutability at pre-foundational level.', 
   ARRAY['Cybersecurity', 'Web3', 'Blockchain'], 'View Showcase', 'https://abatisabtu.com', 'https://abatisabtu.com', 
   'https://abatisabtu.com', NULL, '/lovable-uploads/abtu-coin.png', 'token', false, 7),
  
  ('FacialDX', 'Private', 'Revolutionizing global health and wellness with AI-powered facial analysis to screen for head injury, PTSD, depression, and despair.', 
   ARRAY['AI Health Diagnostics', 'Mental Health', 'Medical Technology'], 'View Showcase', '/showcase/facial-dx', 'https://facialdx.com/', 
   NULL, NULL, '/lovable-uploads/facialdx-thumbnail.png', 'private', false, 8);
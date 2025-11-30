-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  source TEXT,
  vertical_slug TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add email validation constraint
ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add status validation constraint
ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT valid_status CHECK (status IN ('active', 'unsubscribed', 'bounced'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_vertical ON public.newsletter_subscribers(vertical_slug);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view all subscribers
CREATE POLICY "Admins can view all subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update subscribers
CREATE POLICY "Admins can update subscribers"
  ON public.newsletter_subscribers
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_newsletter_subscribers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_newsletter_subscribers_updated_at();

-- Add comment to table
COMMENT ON TABLE public.newsletter_subscribers IS 'Stores newsletter subscription information with email validation and RLS policies';
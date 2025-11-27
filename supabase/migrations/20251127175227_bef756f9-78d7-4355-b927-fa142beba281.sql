-- Create AI credit usage tracking table
CREATE TABLE IF NOT EXISTS public.ai_credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  vertical_slug TEXT,
  model_used TEXT NOT NULL,
  api_calls INTEGER NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  failed_calls INTEGER NOT NULL DEFAULT 0,
  error_402_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_credit_usage ENABLE ROW LEVEL SECURITY;

-- Admins can view all usage
CREATE POLICY "Admins can view all usage"
  ON public.ai_credit_usage
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert usage
CREATE POLICY "Admins can insert usage"
  ON public.ai_credit_usage
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update usage
CREATE POLICY "Admins can update usage"
  ON public.ai_credit_usage
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_ai_credit_usage_date ON public.ai_credit_usage(date DESC);
CREATE INDEX idx_ai_credit_usage_vertical ON public.ai_credit_usage(vertical_slug, date DESC);

-- Create trigger to update updated_at
CREATE TRIGGER update_ai_credit_usage_updated_at
  BEFORE UPDATE ON public.ai_credit_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
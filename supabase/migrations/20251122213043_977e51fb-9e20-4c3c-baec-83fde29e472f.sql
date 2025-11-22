-- Create table to track AI processing jobs
CREATE TABLE IF NOT EXISTS public.ai_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_slug TEXT NOT NULL,
  total_chunks INTEGER NOT NULL,
  processed_chunks INTEGER[] DEFAULT '{}',
  failed_chunks INTEGER[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all processing jobs"
  ON public.ai_processing_jobs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create processing jobs"
  ON public.ai_processing_jobs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update processing jobs"
  ON public.ai_processing_jobs
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete processing jobs"
  ON public.ai_processing_jobs
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_ai_processing_jobs_vertical_status ON public.ai_processing_jobs(vertical_slug, status);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_processing_jobs_updated_at
  BEFORE UPDATE ON public.ai_processing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
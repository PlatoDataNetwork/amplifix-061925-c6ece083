-- Create import_history table to track all import runs
CREATE TABLE IF NOT EXISTS public.import_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_slug text NOT NULL,
  imported_count integer NOT NULL DEFAULT 0,
  skipped_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  total_processed integer NOT NULL DEFAULT 0,
  duration_ms bigint,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'partial')),
  imported_by uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_import_history_vertical_slug ON public.import_history(vertical_slug);
CREATE INDEX IF NOT EXISTS idx_import_history_started_at ON public.import_history(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_history_status ON public.import_history(status);

-- Enable RLS
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Import history is viewable by everyone"
  ON public.import_history
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert import history"
  ON public.import_history
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update import history"
  ON public.import_history
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete import history"
  ON public.import_history
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
-- Create table to track backup job state
CREATE TABLE IF NOT EXISTS public.backup_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name text NOT NULL UNIQUE,
  backup_description text,
  vertical_slug text,
  total_articles integer NOT NULL,
  processed_articles integer DEFAULT 0,
  total_chunks integer NOT NULL,
  completed_chunks integer[] DEFAULT '{}',
  current_chunk integer DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress',
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  paused_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.backup_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all backup jobs"
  ON public.backup_jobs FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create backup jobs"
  ON public.backup_jobs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update backup jobs"
  ON public.backup_jobs FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete backup jobs"
  ON public.backup_jobs FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create index for faster lookups
CREATE INDEX idx_backup_jobs_status ON public.backup_jobs(status);
CREATE INDEX idx_backup_jobs_backup_name ON public.backup_jobs(backup_name);

-- Add trigger for updated_at
CREATE TRIGGER update_backup_jobs_updated_at
  BEFORE UPDATE ON public.backup_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
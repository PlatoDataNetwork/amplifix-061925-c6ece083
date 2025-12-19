-- Enable RLS on import_logs table
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

-- Admin read access for import_logs
CREATE POLICY "Admins can view import logs"
  ON public.import_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin full access for import_logs
CREATE POLICY "Admins can manage import logs"
  ON public.import_logs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on import_schedules table
ALTER TABLE public.import_schedules ENABLE ROW LEVEL SECURITY;

-- Admin read access for import_schedules
CREATE POLICY "Admins can view import schedules"
  ON public.import_schedules
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin full access for import_schedules
CREATE POLICY "Admins can manage import schedules"
  ON public.import_schedules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Add cancellation support to import_history table
ALTER TABLE public.import_history 
ADD COLUMN IF NOT EXISTS cancelled BOOLEAN NOT NULL DEFAULT false;

-- Add index for faster lookups during import checks
CREATE INDEX IF NOT EXISTS idx_import_history_status_vertical 
ON public.import_history(vertical_slug, status, cancelled);

-- Add function to check if an import should be cancelled
CREATE OR REPLACE FUNCTION public.should_cancel_import(
  p_vertical_slug TEXT,
  p_started_after TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.import_history 
    WHERE vertical_slug = p_vertical_slug 
      AND started_at >= p_started_after
      AND status = 'in_progress'
      AND cancelled = true
  );
END;
$$;

-- Add comment for documentation
COMMENT ON COLUMN public.import_history.cancelled IS 'Flag to signal import cancellation to running edge functions';
COMMENT ON FUNCTION public.should_cancel_import IS 'Checks if an import should be cancelled based on vertical and start time';
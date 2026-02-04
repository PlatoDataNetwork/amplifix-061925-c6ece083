-- Drop existing permissive policies on import_schedules
DROP POLICY IF EXISTS "Allow read access on import_schedules" ON public.import_schedules;
DROP POLICY IF EXISTS "Allow public read access on import_schedules" ON public.import_schedules;
DROP POLICY IF EXISTS "import_schedules_select_policy" ON public.import_schedules;

-- Ensure RLS is enabled
ALTER TABLE public.import_schedules ENABLE ROW LEVEL SECURITY;

-- Create admin-only SELECT policy
CREATE POLICY "Admin only read access on import_schedules" 
ON public.import_schedules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create admin-only INSERT policy
CREATE POLICY "Admin only insert access on import_schedules" 
ON public.import_schedules 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create admin-only UPDATE policy
CREATE POLICY "Admin only update access on import_schedules" 
ON public.import_schedules 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create admin-only DELETE policy
CREATE POLICY "Admin only delete access on import_schedules" 
ON public.import_schedules 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);
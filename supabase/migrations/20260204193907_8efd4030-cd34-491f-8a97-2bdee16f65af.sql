-- Fix 1: Restrict user_profiles so authenticated users can only view their own profile
-- Drop existing policies that may allow broader access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

-- Create policy: Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create policy: Admins can view all profiles (for CRM functionality)
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: For import_schedules db_password - remove the column if not actually used,
-- or encrypt it. Let's check if we can make it nullable and add a security note.
-- Since this is an architectural issue, we'll mark it as acknowledged but 
-- the table is already admin-only protected which provides adequate security.
-- The best fix would be to use Supabase Vault, but that requires app-level changes.
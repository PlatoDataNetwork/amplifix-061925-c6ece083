-- Fix 1: Add explicit deny policy for public SELECT on user_profiles
-- First drop any conflicting policies
DROP POLICY IF EXISTS "Deny public access" ON public.user_profiles;

-- Add policy that ensures only authenticated users can read their own profile
-- (The existing policies allow admins to read all, users to read own - this is correct behavior)
-- We need to ensure anon users cannot access any profiles
CREATE POLICY "Deny anonymous access on user_profiles"
ON public.user_profiles
FOR SELECT
TO anon
USING (false);

-- Fix 2: Add explicit deny policy for public SELECT on newsletter_subscribers
DROP POLICY IF EXISTS "Deny public access" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Deny anonymous access on newsletter_subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Deny anonymous access on newsletter_subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO anon
USING (false);

-- Fix 3: For import_schedules - the db_password storage issue is architectural
-- We can't easily move to Vault in a migration, but we can add a note
-- The table already has admin-only policies, so it's reasonably protected
-- The warning about plaintext passwords is valid but requires application-level changes

-- Add a comment to document the security consideration
COMMENT ON COLUMN public.import_schedules.db_password IS 'SECURITY: Consider migrating to Supabase Vault for encrypted credential storage';
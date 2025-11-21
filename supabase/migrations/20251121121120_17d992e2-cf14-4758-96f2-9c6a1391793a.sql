-- Add admin role to Fahad@platodata.io
-- First, check if the user exists and get their ID
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID for Fahad@platodata.io from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'Fahad@platodata.io';
  
  -- If user exists, insert admin role (if not already present)
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role added to Fahad@platodata.io';
  ELSE
    RAISE NOTICE 'User Fahad@platodata.io not found. Please create the account first.';
  END IF;
END $$;
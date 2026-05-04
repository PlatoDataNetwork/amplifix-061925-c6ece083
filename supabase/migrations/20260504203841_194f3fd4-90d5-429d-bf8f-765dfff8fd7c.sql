ALTER TABLE public.import_schedules
  DROP COLUMN IF EXISTS db_password,
  DROP COLUMN IF EXISTS db_user,
  DROP COLUMN IF EXISTS db_host,
  DROP COLUMN IF EXISTS db_name,
  DROP COLUMN IF EXISTS db_port;
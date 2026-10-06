/*
# Create auth identity for admin user

Links the auth.identities record to the existing auth.users row.
The `email` column is generated, so it's omitted from the INSERT.
*/

DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@kphbkatana.com';
  IF admin_id IS NOT NULL THEN
    INSERT INTO auth.identities (
      id,
      provider_id,
      user_id,
      identity_data,
      provider,
      created_at,
      updated_at
    )
    SELECT
      gen_random_uuid(),
      admin_id::text,
      admin_id,
      jsonb_build_object('sub', admin_id::text, 'email', 'admin@kphbkatana.com'),
      'email',
      now(),
      now()
    WHERE NOT EXISTS (
      SELECT 1 FROM auth.identities WHERE user_id = admin_id
    );
  END IF;
END $$;

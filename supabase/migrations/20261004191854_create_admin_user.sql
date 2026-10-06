/*
# Create default admin user

Creates an admin user in Supabase auth so the admin panel can be accessed.
Uses a DO block with IF NOT EXISTS to avoid duplicates.
*/

DO $$
DECLARE
  existing_count int;
BEGIN
  SELECT count(*) INTO existing_count FROM auth.users WHERE email = 'admin@kphbkatana.com';
  IF existing_count = 0 THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      email_confirmed_at,
      encrypted_password,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@kphbkatana.com',
      now(),
      crypt('KatanaAdmin2026!', gen_salt('bf')),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      false
    );
  END IF;
END $$;

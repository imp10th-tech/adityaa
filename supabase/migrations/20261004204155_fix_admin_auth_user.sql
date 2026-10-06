-- Remove the broken admin user that was created via raw SQL insert.
-- The password hash format is incompatible with Supabase Auth's expected format,
-- causing "database error querying schema" on login.
-- The user will be recreated through the proper supabase.auth.signUp() flow.

DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@kphbkatana.com'
);

DELETE FROM auth.users WHERE email = 'admin@kphbkatana.com';

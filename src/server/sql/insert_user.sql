INSERT INTO public.users (account_id, user_role)
VALUES ($1, NULL)
ON CONFLICT (account_id) DO NOTHING
RETURNING user_id, account_id, user_role;

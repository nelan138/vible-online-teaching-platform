UPDATE public.users
SET user_role = $2
WHERE account_id = $1
RETURNING user_id, account_id, user_role;

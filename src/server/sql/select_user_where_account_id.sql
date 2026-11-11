SELECT user_id, account_id, user_role
FROM public.users
WHERE account_id = $1;

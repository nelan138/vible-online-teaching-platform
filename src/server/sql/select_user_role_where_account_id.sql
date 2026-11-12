SELECT user_role
FROM public.users
WHERE account_id = $1;

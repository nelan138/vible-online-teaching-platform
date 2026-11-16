SELECT id, name, role
FROM public.users
WHERE id = $1::uuid;

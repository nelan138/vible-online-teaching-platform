INSERT INTO public.users (id, name, role)
VALUES ($1::uuid, $2, $3)
RETURNING id, name, role;

INSERT INTO public.course (id, name, description, "teacherId", "inviteCode")
VALUES ($1::uuid, $2, $3, $4::uuid, $5);

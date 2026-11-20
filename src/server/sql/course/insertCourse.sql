INSERT INTO public.course (id, name, "teacherId", "inviteCode")
VALUES ($1::uuid, $2, $3::uuid, $4);

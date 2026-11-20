SELECT id, name, description, "teacherId", "inviteCode"
FROM public.course
WHERE "teacherId" = $1::uuid;

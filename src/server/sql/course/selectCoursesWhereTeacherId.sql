SELECT id, name, "teacherId", "inviteCode"
FROM public.course
WHERE "teacherId" = $1::uuid;

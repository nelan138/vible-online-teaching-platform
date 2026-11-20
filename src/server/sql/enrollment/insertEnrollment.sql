INSERT INTO public.enrollment ("studentId", "courseId")
SELECT $1::uuid, id
FROM public.course
WHERE "inviteCode" = $2;

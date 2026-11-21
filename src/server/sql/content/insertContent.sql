INSERT INTO public.content (id, "courseId", title, description)
SELECT $3::uuid, course.id, $4::text, $5::text
FROM public.course AS course
JOIN public.users AS teacher ON teacher.id = course."teacherId"
WHERE course.id = $1::uuid
  AND teacher.id = $2::uuid
  AND teacher.role = 'teacher'
RETURNING id, "courseId", title, description, "createdAt";

SELECT content.id
FROM public.content AS content
JOIN public.course AS course ON course.id = content."courseId"
JOIN public.users AS teacher ON teacher.id = course."teacherId"
WHERE content.id = $1::uuid
  AND course.id = $2::uuid
  AND teacher.id = $3::uuid
  AND teacher.role = 'teacher';

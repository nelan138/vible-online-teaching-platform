SELECT content.id, content."courseId", content.title, content.description, content."createdAt"
FROM public.course AS course
JOIN public.users AS teacher ON teacher.id = course."teacherId"
LEFT JOIN public.content AS content ON content."courseId" = course.id
WHERE course.id = $1::uuid
  AND teacher.id = $2::uuid
  AND teacher.role = 'teacher'
ORDER BY content."createdAt" DESC, content.id DESC;

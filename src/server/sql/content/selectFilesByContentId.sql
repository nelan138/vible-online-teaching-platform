SELECT file.id, file.name, file."mimeType", file."sizeBytes"
FROM public.content AS content
JOIN public.course AS course ON course.id = content."courseId"
JOIN public.users AS teacher ON teacher.id = course."teacherId"
LEFT JOIN public."fileContent" AS attachment ON attachment."contentId" = content.id
LEFT JOIN public.file AS file ON file.id = attachment."fileId"
WHERE content.id = $1::uuid
  AND course.id = $2::uuid
  AND teacher.id = $3::uuid
  AND teacher.role = 'teacher'
ORDER BY file.name, file.id;

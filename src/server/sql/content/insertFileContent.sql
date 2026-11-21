WITH inserted_file AS (
   INSERT INTO public.file (id, name, "mimeType", "sizeBytes")
   SELECT $4::text, $5::text, $6::text, $7::bigint
   FROM public.content AS content
   JOIN public.course AS course ON course.id = content."courseId"
   JOIN public.users AS teacher ON teacher.id = course."teacherId"
   WHERE content.id = $1::uuid
     AND course.id = $2::uuid
     AND teacher.id = $3::uuid
     AND teacher.role = 'teacher'
   RETURNING id
)
INSERT INTO public."fileContent" ("fileId", "contentId")
SELECT id, $1::uuid
FROM inserted_file
RETURNING "fileId", "contentId";

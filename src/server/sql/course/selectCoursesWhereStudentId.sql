SELECT c.id, c.name, c."teacherId"
FROM public.course AS c
JOIN public.enrollment AS e ON e."courseId" = c.id
WHERE e."studentId" = $1::uuid
  AND e.status = 'approved';

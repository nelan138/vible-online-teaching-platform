SELECT e."studentId", e."courseId", e.status
FROM public.enrollment AS e
JOIN public.course AS c ON c.id = e."courseId"
WHERE e."courseId" = $1::uuid
  AND c."teacherId" = $2::uuid
  AND e.status = 'pending';

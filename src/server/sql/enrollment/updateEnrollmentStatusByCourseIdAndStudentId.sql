UPDATE public.enrollment AS e
SET status = $4::text
FROM public.course AS c
WHERE e."courseId" = $1::uuid
  AND e."studentId" = $2::uuid
  AND c.id = e."courseId"
  AND c."teacherId" = $3::uuid
  AND e.status = 'pending'
  AND $4::text IN ('approved', 'rejected');

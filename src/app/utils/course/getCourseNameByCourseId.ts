export async function getCourseNameByCourseId(courseId: string): Promise<string> {
   const id = courseId.toLowerCase();
   const courses = await getCourses();
   const course = courses.find(course => course.id === id);

   if (!course?.name.trim()) throw new Error('Could not determine the course name.');

   return course.name;
}

Use Pinia store option syntax only

- use states as cache, loaded on load*()
- actions with get* add*

## Teacher courses

- `loadCourses(teacherId)` caches the teacher's courses in `store.courses`
- `addCourse(course)` adds the course to the temporary data and cache, and throws if the course ID already exists

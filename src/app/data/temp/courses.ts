import { teacher } from "./user";

export const courses: Course[] = [
   {
      id: "6c446688-4800-47fb-86a1-974fa73c5fcb",
      name: "Web Development",
      teacherId: teacher.id,
      teacherName: teacher.name,
      description: "Build a personal website with HTML and CSS.",
   },
   {
      id: "2da9fc54-2348-485a-801d-fcca7494018b",
      name: "Database Design",
      teacherId: teacher.id,
      teacherName: teacher.name,
      description: "Model a course catalog and query it with SQL.",
   },
   {
      id: "e7642691-c911-4596-b424-d9244876e69b",
      name: "Programming Fundamentals",
      teacherId: teacher.id,
      teacherName: teacher.name,
      description: "Write small programs using loops and functions.",
   },
   {
      id: "f8e6612f-d799-4a33-a666-47b537d23260",
      name: "Interface Design",
      teacherId: teacher.id,
      teacherName: teacher.name,
      description: "Sketch and prototype a mobile login screen.",
   },
];

<template>
   <UContainer>
      <VPageHero />

      <h1 class="text-heading-1">My Courses</h1>

      <div class="flex flex-col gap-4">
         <VCourseCard
            v-for="card in cards"
            :key="card.key"
            :to="card.to"
            :title="card.title"
            :description="card.description"
            :author="card.author"
         />
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "authenticate-user" });

const route = useRoute();
const teacherCoursesStore = useTeacherCoursesStore();
const studentEnrollmentsStore = useStudentEnrollmentsStore();
const user = route.meta.user;

/* *** */

type Card = {
   key: string;
   to: string;
   title: string;
   description?: string;
   author: {
      name: string;
   };
};

const cards = ref<Card[]>([]);

onMounted(async () => {
   if (user.role === "teacher") {
      await teacherCoursesStore.loadCourses(user.id);

      cards.value = teacherCoursesStore.courses.map((course) => ({
         key: course.id,
         to: `/courses/${course.id}`,
         title: course.name,
         description: course.description,
         author: { name: course.teacherName },
      }));
   }

   // takes only enrollments where status = 'approved'
   if (user.role === "student") {
      await studentEnrollmentsStore.loadEnrollments(user.id);
      cards.value = studentEnrollmentsStore.enrollments
         .filter((enrollment) => enrollment.status === "approved")
         .map((enrollment) => ({
            key: enrollment.courseId,
            to: `/courses/${enrollment.courseId}`,
            title: enrollment.courseName,
            description: enrollment.description,
            author: { name: enrollment.teacherName },
         }));
   }
});
</script>

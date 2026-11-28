<template>
   <UContainer>
      <h1 class="text-heading-1">My Courses</h1>

      <div class="grid grid-cols-3 gap-8">
         <VCourseCard
            v-for="card in cards"
            :key="card.key"
            :to="card.to"
            :title="card.title"
            :description="card.description"
            :author="card.author"
            :badge="card.badge"
            image="/img/default-card-cover.png"
         />
      </div>

      <VDropdownMenu>
         <UButton
            v-if="user.role === 'teacher'"
            icon="lucide:book-plus"
            label="Add course"
            variant="solid"
         />

         <UButton
            v-if="user.role === 'student'"
            icon="lucide:log-in"
            label="Join course"
            variant="solid"
         />
      </VDropdownMenu>
   </UContainer>
</template>

<script setup lang="ts">
import type { BadgeProps } from "@nuxt/ui";

definePageMeta({ middleware: "authenticate-user" });

const route = useRoute();
const teacherCoursesStore = useTeacherCoursesStore();
const studentEnrollmentsStore = useStudentEnrollmentsStore();
const user: User = route.meta.user;

/* *** */

type Card = {
   key: string;
   to: string;
   title: string;
   description?: string;
   author: { name: string };
   badge?: BadgeProps;
};

const cards = shallowRef<Card[]>([]);

const statusColors = {
   pending: "warning",
   approved: "success",
   rejected: "error",
} satisfies Record<Enrollment["status"], BadgeProps["color"]>;

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

   if (user.role === "student") {
      await studentEnrollmentsStore.loadEnrollments(user.id);
      cards.value = studentEnrollmentsStore.enrollments.map((enrollment) => ({
         key: enrollment.courseId,
         to: `/courses/${enrollment.courseId}`,
         title: enrollment.courseName,
         description: enrollment.description,
         author: { name: enrollment.teacherName },
         badge: {
            label: enrollment.status,
            color: statusColors[enrollment.status],
            variant: "solid",
         },
      }));
   }
});
</script>

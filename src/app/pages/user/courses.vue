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
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "authenticate-user" });
import type { BadgeProps } from "@nuxt/ui";

const route = useRoute();
const teacherCoursesStore = useTeacherCoursesStore();
const user = route.meta.user;

/* *** */

type CourseCard = {
   key: string;
   to: string;
   title: string;
   description?: string;
   author: { name: string };
   badge?: BadgeProps;
};

const cards = ref<CourseCard[]>([]);

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
});
</script>

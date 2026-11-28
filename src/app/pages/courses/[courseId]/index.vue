<template>
   <UPage>
      <UPageHeader :title="courseName" />

      <template #left>
         <UPageAside class="lg:ms-0">
            <template #top>
               <UInput
                  v-model="filter"
                  icon="lucide:search"
                  aria-label="Filter courses"
                  placeholder="Filter..."
                  variant="soft"
               />
            </template>

            <UContentNavigation
               v-if="filteredCourseLinks.length"
               variant="link"
               :navigation="[
                  {
                     title: 'My Courses',
                     path: '/user/courses',
                     children: filteredCourseLinks,
                  },
               ]"
               :collapsible="false"
            />
            <p v-else-if="filter" class="text-sm text-muted">
               No matching courses
            </p>
         </UPageAside>
      </template>

      <template #right>
         <UContentToc
            highlight
            highlight-color="primary"
            highlight-variant="circuit"
            :title="courseName"
            :links="tocLinks"
         />
      </template>

      <h1 id="recent-activities" class="text-heading-1">Recent activities</h1>

      <div class="space-y-4">
         <UBlogPost
            title="Introducing Nuxt Icon v1"
            description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
            date="2024-11-25"
         />

         <UBlogPost
            title="Introducing Nuxt Icon v1"
            description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
            date="2024-11-25"
         />

         <UBlogPost
            title="Introducing Nuxt Icon v1"
            description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
            date="2024-11-25"
         />
      </div>

      <h1 id="content" class="text-heading-1">Content</h1>

      <template v-for="content in contentsStore.contents" :key="content.id">
         <VContentCard
            :id="`content-${content.id}`"
            :title="content.name"
            :description="content.description"
            class="mb-4"
         >
            <template #header-actions>
               <UButton icon="lucide:file-plus" label="Attach files" />
               <UButton icon="lucide:ellipsis-vertical" />
            </template>

            <p>Content Here!</p>
         </VContentCard>
      </template>

      <h1 id="assignments" class="text-heading-1">Assignments</h1>
   </UPage>
</template>

<script setup lang="ts">
import type { ContentTocLink } from "@nuxt/ui";

const route = useRoute();
const courseId = route.params.courseId as string;
const user = route.meta.user;
const contentsStore = useCourseContentsStore();
const teacherCoursesStore = useTeacherCoursesStore();
const studentEnrollmentsStore = useStudentEnrollmentsStore();
const courseLinks = ref<{ title: string; path: string }[]>([]);
const filter = ref("");

const filteredCourseLinks = computed(() => {
   const query = filter.value.trim().toLowerCase();
   return courseLinks.value.filter((link) =>
      link.title.toLowerCase().includes(query),
   );
});

/* *** */

const tocLinks = computed<ContentTocLink[]>(() => [
   {
      id: "content",
      depth: 2,
      text: "Content",
      children: contentsStore.contents.map((content) => ({
         id: `content-${content.id}`,
         depth: 3,
         text: content.name,
      })),
   },
]);

/* *** */

onMounted(() => {
   contentsStore.loadContents(courseId);

   if (user.role === "teacher") {
      teacherCoursesStore.loadCourses(user.id);
      courseLinks.value = teacherCoursesStore.courses.map((course) => ({
         title: course.name,
         path: `/courses/${course.id}`,
      }));
   } else {
      studentEnrollmentsStore.loadEnrollments(user.id);
      courseLinks.value = studentEnrollmentsStore.enrollments
         .filter((e) => e.status === "approved")
         .map((enrollment) => ({
            title: enrollment.courseName,
            path: `/courses/${enrollment.courseId}`,
         }));
   }
});

const courseName = computed(() => contentsStore.contents[0]?.courseName);
</script>

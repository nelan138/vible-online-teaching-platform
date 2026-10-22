<template>
   <UContainer v-if="course" class="py-6">
      <USidebar
         v-model:open="isSidebarOpen"
         collapsible="icon"
         rail
         :ui="{
            container:
               'top-(--ui-header-height) h-[calc(100svh-var(--ui-header-height))] bg-default border-r border-default',
         }"
      >
         <template #header="{ state }">
            <UButton
               :icon="state === 'collapsed' ? 'lucide:arrow-right-from-line' : 'lucide:arrow-left-from-line'"
               :label="state === 'expanded' ? 'Close' : undefined"
               variant="ghost"
               color="neutral"
               :aria-label="state === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'"
               @click="isSidebarOpen = !isSidebarOpen"
            />
         </template>

         <template #default="{ state }">
            <UNavigationMenu
               orientation="vertical"
               :items="sidebarItems"
               :collapsed="state === 'collapsed'"
               class="w-full"
            />
         </template>
      </USidebar>

      <div>
         <h2 class="text-2xl font-bold text-highlighted">{{ course.title }}</h2>
         <p class="text-muted mt-1">Teachers: {{ course.teacher }}</p>

         <div class="grid grid-cols-1 gap-8 mt-4">
            <ContentPlaceholder class="h-50" />
            <ContentPlaceholder class="h-100" />
            <ContentPlaceholder class="h-80" />
            <ContentPlaceholder class="h-100" />
         </div>
      </div>

   </UContainer>

   <UContainer v-else class="py-6">
      <p class="text-muted">Course not found.</p>
   </UContainer>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

definePageMeta({
   layout: 'app',
});

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const route = useRoute();
const id = Number(route.params.id);

/* *** */

const isSidebarOpen = ref(false);

const course = ref<Course>();

onMounted(() => {
   course.value = courses.value.find((c) => c.id === id);
});

const sidebarItems = computed<NavigationMenuItem[][]>(() => [
   [
      {
         label: 'Recent activities',
         icon: 'lucide:clock',
      },
      {
         label: 'Discussion Forum',
         icon: 'lucide:messages-square',
      },
      {
         label: 'Content',
         icon: 'lucide:layers',
      },
   ],
   [
      {
         label: 'Participants',
         icon: 'lucide:users',
      },
      {
         label: 'Back to Courses',
         icon: 'lucide:arrow-left',
         to: '/courses',
      },
   ],
]);
</script>

<style scoped></style>

<template>
   <UContainer>
      <PageSection v-if="user.role === 'student'">
         <UFieldGroup class="ms-auto flex w-fit">
            <UInput placeholder="Enter invite code" />

            <UButton label="Join" color="neutral" />
         </UFieldGroup>
      </PageSection>

      <PageSection title="My courses">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- ! Teacher Only -->
            <template v-if="user.role === 'teacher'">
               <PageCard v-for="course in courses" :key="course.id" image="/images/placeholder.svg">
                  <H3 class="hover:underline hover:text-info">
                     <NuxtLink :to="`/course/${course.id}`">
                        {{ course.name }}
                     </NuxtLink>
                  </H3>

                  <Description v-if="teacherNames[course.teacherId] !== undefined">
                     {{ teacherNames[course.teacherId] ?? 'Unknown teacher' }}
                  </Description>

                  <template #footer>
                     <div class="flex justify-between items-center">
                        <UButton
                           :to="`/course/${course.id}`"
                           icon="lucide:square-arrow-right-enter"
                           variant="ghost"
                           color="neutral"
                        />

                        <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
                     </div>
                  </template>
               </PageCard>
            </template>
         </div>
      </PageSection>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
});

const coursesStore = useCoursesStore();
const userStore = useUserStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
const user = computed(() => {
   const profile = userStore.user;
   if (!profile) throw createError({ statusCode: 503, statusMessage: 'Account profile is unavailable' });
   return profile;
});

const teacherIds = computed(() => [...new Set(courses.value.map((course) => course.teacherId))]);
const { data: teacherNames } = useAsyncData<Record<string, string | null>>(
   'course-teacher-names',
   async () => {
      const names = await Promise.all(
         teacherIds.value.map(async (teacherId) => {
            const [name] = await tryCatch(getUserNameByUserId(teacherId));
            return [teacherId, name] as const;
         })
      );
      return Object.fromEntries(names);
   },
   { server: false, default: () => ({}), watch: [() => teacherIds.value.join(',')] }
);
</script>

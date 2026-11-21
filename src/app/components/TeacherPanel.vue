<template>
   <FloatingPanel v-slot="{ close }">
      <UButton
         icon="lucide:plus"
         label="Add new course"
         aria-haspopup="dialog"
         @click="openAddCourseModal(close)"
      />

      <UButton
         v-if="courseId"
         icon="lucide:plus"
         label="Add new content"
         aria-haspopup="dialog"
         @click="openAddContentModal(close)"
      />

      <UButton
         icon="lucide:square-arrow-left-exit"
         label="Log out"
         loading-auto
         color="warning"
         @click="logOut"
      />
   </FloatingPanel>
</template>

<script setup lang="ts">
import { LazyAddContentModal, LazyAddCourseModal } from '#components';

const route = useRoute();
const router = useRouter();

/* *** */

const addCourseModal = useModal(LazyAddCourseModal);
const addContentModal = useModal(LazyAddContentModal);
const courseId = computed(() => {
   const id = route.params.id;
   return route.path.startsWith('/course/') && typeof id === 'string' ? id : undefined;
});

async function openAddCourseModal(close: () => Promise<void>) {
   await close();

   if (router.currentRoute.value.name !== 'user-courses') {
      await router.push({ name: 'user-courses' });
   }

   if (router.currentRoute.value.name === 'user-courses') void addCourseModal.open();
}

async function openAddContentModal(close: () => Promise<void>) {
   await close();
   if (courseId.value) void addContentModal.open({ courseId: courseId.value });
}
</script>

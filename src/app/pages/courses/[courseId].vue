<template>
   <UContainer>
      <h1 class="text-heading-1">
         {{ contentsStore.contents[1]?.courseName }}
      </h1>

      <template v-for="content in contentsStore.contents" :key="content.id">
         <VContentCard
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
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "authenticate-user" });
const courseId = useRoute().params.courseId as string;

const contentsStore = useCourseContentsStore();

/* *** */

onMounted(() => {
   contentsStore.loadContents(courseId);
});
</script>

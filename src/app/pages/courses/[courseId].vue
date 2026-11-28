<template>
   <div>
      <div class="border-b border-default">
         <UContainer class="overflow-x-auto">
            <UNavigationMenu
               aria-label="Course navigation"
               :items="items"
               variant="link"
               highlight
            />

            <VDropdownMenu>
               <UButton
                  icon="lucide:user-round-plus"
                  label="Invite other students"
                  color="info"
                  variant="solid"
               />

               <UButton
                  icon="lucide:send"
                  label="Send a message"
                  variant="solid"
               />

               <UButton
                  v-if="user.role === 'teacher'"
                  icon="lucide:file-plus"
                  label="Add content"
                  variant="solid"
               />

               <UButton
                  v-if="user.role === 'teacher'"
                  icon="lucide:clipboard-plus"
                  label="Add assignment"
                  variant="solid"
               />

               <UButton
                  v-if="user.role === 'teacher'"
                  icon="lucide:megaphone"
                  label="Post announcement"
                  variant="solid"
               />

               <UButton
                  v-if="user.role === 'student'"
                  icon="lucide:log-out"
                  label="Leave course"
                  color="error"
                  variant="solid"
               />

               <UButton
                  v-if="user.role === 'teacher'"
                  icon="lucide:trash-2"
                  label="Delete course"
                  color="error"
                  variant="solid"
               />
            </VDropdownMenu>
         </UContainer>
      </div>

      <NuxtPage />
   </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "authenticate-user" });

const route = useRoute();

const user: User = route.meta.user;

const items = computed(() => {
   const path = `/courses/${route.params.courseId}`;
   return [
      { label: "Overview", icon: "i-lucide-book-open", to: path, exact: true },
      { label: "Roster", icon: "i-lucide-users", to: `${path}/roster` },
      {
         label: "Announcements",
         icon: "i-lucide-megaphone",
         to: `${path}/announcements`,
      },
      { label: "Forum", icon: "i-lucide-messages-square", to: `${path}/forum` },
   ];
});
</script>

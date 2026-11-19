<template>
   <UContainer class="py-8">
      <UPageCard title="Debug" class="max-w-md mx-auto">
         <UButton label="Log out" loading-auto @click="logOut" />
      </UPageCard>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'account' });

const auth = useAuth();
const toast = useToast();

async function logOut() {
   const [result, error] = await tryCatch(auth.signOut());
   const signOutError = error ?? result?.error;

   if (signOutError) {
      toast.add({
         title: 'Could not log out',
         description: signOutError.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   return navigateTo('/account/login');
}
</script>

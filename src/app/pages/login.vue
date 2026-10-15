<template>
   <div class="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-4">
      <UPageCard class="w-full max-w-sm">
         <UAuthForm
            title="Sign in"
            description="Enter your credentials to access your account."
            icon="i-lucide-lock"
            :fields="fields"
            :submit="{ label: 'Sign in' }"
            @submit="onSubmit"
         />
      </UPageCard>

      <div class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-3 text-xs text-neutral-500">
         <span class="text-[11px] font-medium tracking-wide text-neutral-400 dark:text-neutral-500">This is for debugging only</span>
         <div class="flex items-center gap-2">
            <UButton size="xs" variant="subtle" color="neutral" label="homepage" icon="lucide:house" @click="navigateTo('/homepage')" />
            <UButton size="xs" variant="subtle" color="neutral" label="admin" icon="lucide:badge-alert" @click="navigateTo('/admin')" />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { AuthFormField } from '@nuxt/ui';
const toast = useToast();

definePageMeta({
   layout: 'login',
});

/* *** */

const fields: AuthFormField[] = [
   {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
   },
   {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
   },
];

function onSubmit() {
   // * todo: implement sign in logic here
   toast.add({
      title: 'Sign in',
      description: 'You have successfully signed in.',
   });
}
</script>

<style scoped></style>

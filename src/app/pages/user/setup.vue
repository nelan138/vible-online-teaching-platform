<template>
   <UContainer>
      <UPageCard title="Set up your account" class="max-w-md mx-auto">
         <UForm :state="state" :validate="validate" :disabled="!userId" class="space-y-4" @submit="onSubmit">
            <UFormField name="name" label="Name" required>
               <UInput v-model="state.name" placeholder="Your name" autocomplete="name" class="w-full" />
            </UFormField>

            <UFormField name="role" label="Role" required>
               <USelect v-model="state.role" :items="roles" placeholder="Choose your role" class="w-full" />
            </UFormField>

            <UButton type="submit" label="Complete setup" block />
         </UForm>
      </UPageCard>
   </UContainer>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui';

definePageMeta({ layout: 'account' });

const toast = useToast();

/* *** */

const userId = ref<string>();

const state = reactive<{ name: string; role: UserRecord['role'] | undefined }>({
   name: '',
   role: undefined,
});

const roles = [
   { label: 'Student', value: 'student' },
   { label: 'Teacher', value: 'teacher' },
];

onMounted(async () => {
   const [loggedIn, logInError] = await tryCatch(userIsLoggedIn());

   if (logInError) {
      toast.add({
         title: 'Could not verify your session',
         description: logInError.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   if (!loggedIn) return navigateTo('/account/login');

   const [setUp, setUpError] = await tryCatch(userSetupIsComplete());

   if (setUpError) {
      toast.add({
         title: 'Could not verify your account setup',
         description: setUpError.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   if (setUp) return navigateTo('/user/dashboard');

   const [user, userError] = await tryCatch(getSessionUser());

   if (userError) {
      toast.add({
         title: 'Could not load your account',
         description: userError.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   if (!user) return navigateTo('/account/login');

   userId.value = user.id;
   state.name = user.name || '';
});

function validate(data: typeof state): FormError[] {
   const errors: FormError[] = [];
   if (!data.name.trim()) errors.push({ name: 'name', message: 'Enter your name.' });
   if (data.role !== 'student' && data.role !== 'teacher') {
      errors.push({ name: 'role', message: 'Choose Student or Teacher.' });
   }
   return errors;
}

async function onSubmit() {
   if (!userId.value || !state.role) return;

   const [, error] = await tryCatch(
      addUser({
         name: state.name.trim(),
         role: state.role,
      })
   );

   if (error) {
      toast.add({
         title: 'Could not save your account setup',
         description: error.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   return navigateTo('/user/dashboard');
}
</script>

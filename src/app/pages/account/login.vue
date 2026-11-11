<template>
   <UContainer>
      <div class="grid grid-cols-[auto_1fr] w-full mx-auto h-fit my-14 max-w-3xl border-2 border-muted rounded-sm">
         <PlaceHolder class="h-full aspect-3/4" text="Image here" />

         <div class="p-12">
            <p v-if="checkingSession" role="status">Checking your session…</p>

            <UAuthForm v-else :fields="fields" :providers="providers" :submit="{ label: 'Sign in' }" @submit="onSubmit">
               <template #password-hint>
                  <NuxtLink to="/account/forgot-password" class="text-xs text-primary font-medium hover:underline">
                     Forgot password?
                  </NuxtLink>
               </template>

               <template #footer>
                  <p class="text-center text-sm text-muted">
                     Don't have an account?
                     <NuxtLink to="/account/sign-up" class="text-primary font-medium hover:underline">
                        Sign up
                     </NuxtLink>
                  </p>
               </template>
            </UAuthForm>
         </div>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   alias: ['/'],
});
const toast = useToast();
const auth = useAuth();

type UserRecord = {
   user_id: string;
   account_id: string;
   user_role: 'student' | 'teacher' | null;
};

const checkingSession = ref(true);
const accountId = ref('');

const fields = [
   {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      required: true,
   },
   {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '••••••••',
      required: true,
   },
];

const providers = [
   {
      label: 'Login with Google',
      icon: 'i-simple-icons-google',
      loadingAuto: true,
      onClick: onGoogleSignIn,
   },
];

async function onGoogleSignIn() {
   const [result, error] = await tryCatch(
      auth.signIn.social({
         provider: 'google',
         callbackURL: new URL('/account/login', window.location.origin).href,
      })
   );

   const signInError = error ?? result?.error;

   if (signInError) {
      toast.add({
         title: 'Google sign-in failed',
         description: signInError.message || 'Please try again.',
         color: 'error',
      });
   }
}

onMounted(async () => {
   const [, error] = await tryCatch(checkSession());
   checkingSession.value = false;

   if (error) {
      toast.add({
         title: 'Could not complete sign-in',
         description: 'Please try again.',
         color: 'error',
      });
   }
});

async function checkSession() {
   const { data, error } = await auth.getSession();

   if (error) throw new Error('Could not check your session.');
   if (!data?.user) return;

   accountId.value = data.user.id;
   await findUser();
}

async function findUser() {
   const userURL = `/api/users/${encodeURIComponent(accountId.value)}`;
   let response = await $fetch.raw<UserRecord>(userURL, {
      ignoreResponseError: true,
   });

   if (response.status === 404) {
      response = await $fetch.raw<UserRecord>('/api/users', {
         method: 'POST',
         body: { account_id: accountId.value },
         ignoreResponseError: true,
      });

      if (response.status === 409) {
         response = await $fetch.raw<UserRecord>(userURL, { ignoreResponseError: true });
      }
   }

   if (!response.ok || !response._data) throw new Error('Could not load your user record.');
   await completeSignIn(response._data);
}

async function completeSignIn(user: UserRecord) {
   if (user.user_role !== 'student' && user.user_role !== 'teacher') {
      await navigateTo('/account/select-role');
      return;
   }

   toast.add({
      title: 'Signed in successfully',
      description: `Signed in as a ${user.user_role}.`,
      color: 'success',
   });
   await navigateTo('/user/dashboard');
}

function onSubmit() {
   toast.add({
      title: 'Form submitted',
      description: `Place holder event`,
   });
}
</script>

<template>
   <UContainer>
      <div class="grid grid-cols-[auto_1fr] w-full mx-auto h-fit my-14 max-w-3xl border-2 border-muted rounded-sm">
         <PlaceHolder class="h-full aspect-3/4" text="Image here" />

         <div class="p-12">
            <UAuthForm :fields="fields" :providers="providers" :submit="{ label: 'Sign in' }" @submit="onSubmit">
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

/* *** */

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
   const { data: session, error: sessionData } = await auth.getSession();

   if (sessionData) {
      toast.add({
         title: 'Could not complete sign-in',
         description: 'Please try again.',
         color: 'error',
      });
      return;
   }

   if (!session?.user) return; // user is not logged in

   const accountId = session.user.id;

   const [user, userError] = await tryCatch($fetch<UserRecord | null>(`/api/users/${accountId}`));

   if (userError) {
      toast.add({ title: 'Could not load your account', description: 'Please try again.', color: 'error' });
      return;
   }

   if (user) {
      if (!user.user_role) return navigateTo('/account/select-role');
      navigateTo('/user/dashboard');
      return;
   } else {
      const [, insertError] = await tryCatch(
         $fetch<UserRecord>('/api/users', {
            method: 'POST',
            body: { account_id: accountId },
         })
      );

      if (insertError) {
         toast.add({
            title: 'Could not create your account',
            description: 'Please try again.',
            color: 'error',
         });

         return;
      }

      navigateTo('/account/select-role');
   }
});

function onSubmit() {
   toast.add({
      title: 'Form submitted',
      description: `Place holder event`,
   });
}
</script>

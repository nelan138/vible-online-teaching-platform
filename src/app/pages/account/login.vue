<template>
   <UContainer>
      <UPageCard orientation="horizontal" class="max-w-3xl mx-auto my-8 overflow-hidden">
         <PlaceHolder class="h-full aspect-3/4" text="Image here" />

         <UAuthForm :fields="fields" :providers="providers" :submit="{ label: 'Sign in' }">
            <template #password-hint>
               <NuxtLink to="/account/forgot-password" class="text-xs text-primary font-medium hover:underline">
                  Forgot password?
               </NuxtLink>
            </template>

            <template #footer>
               <p class="text-center text-sm text-muted">
                  Don't have an account?
                  <NuxtLink to="/account/sign-up" class="text-primary font-medium hover:underline"> Sign up </NuxtLink>
               </p>
            </template>
         </UAuthForm>
      </UPageCard>
   </UContainer>
</template>

<script setup lang="ts">
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
   const [, error] = await tryCatch(
      auth.signIn.social({
         provider: 'google',
         callbackURL: new URL('/', window.location.origin).href,
      })
   );

   if (error) {
      toast.add({
         title: 'Google sign-in failed',
         description: error.message || 'Please try again.',
         color: 'error',
      });
   }
}
</script>

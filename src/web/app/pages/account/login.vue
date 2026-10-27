<template>
   <UContainer>
      <div class="h-dvh">
         <div
            class="grid grid-cols-[auto_1fr] w-full mx-auto h-fit my-14 max-w-3xl border-2 border-muted rounded-sm"
         >
            <!-- <NuxtImg class="h-full" src="/images/3t.jpeg" /> -->
            <ContentPlaceholder class="h-full aspect-3/4" />

            <div class="p-12">
               <UAuthForm
                  :fields="fields"
                  :providers="providers"
                  :submit="{ label: 'Sign in' }"
                  @submit="onSubmit"
               >
                  <template #password-hint>
                     <NuxtLink
                        to="/forgot_password"
                        class="text-xs text-primary font-medium hover:underline"
                     >
                        Forgot password?
                     </NuxtLink>
                  </template>

                  <template #footer>
                     <p class="text-center text-sm text-muted">
                        Don't have an account?
                        <NuxtLink
                           to="/sign_up"
                           class="text-primary font-medium hover:underline"
                        >
                           Sign up
                        </NuxtLink>
                     </p>
                  </template>
               </UAuthForm>
            </div>
         </div>

         <div
            class="flex flex-col items-center justify-center gap-4 mt-8 border-2 border-dashed border-error rounded-sm p-4 w-fit mx-auto"
         >
            <p class="text-error">For debugging only</p>
            <UButton
               label="dashboard"
               to="/dashboard"
               variant="outline"
               icon="lucide:house"
               color="error"
            />
         </div>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   alias: ["/"],
});
const toast = useToast();

/* *** */

const fields = [
   {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "you@example.com",
      required: true,
   },
   {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "••••••••",
      required: true,
   },
   {
      name: "remember",
      type: "checkbox",
      label: "Remember me",
   },
];

const providers = [
   {
      label: "Login with Google",
      icon: "i-simple-icons-google",
      onClick: () => {
         toast.add({
            title: "Google login clicked",
            description: "Place holder event",
         });
      },
   },
];

function onSubmit() {
   toast.add({
      title: "Form submitted",
      description: `Place holder event`,
   });
}
</script>

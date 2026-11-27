<template>
   <UContainer>
      <UPageCard orientation="horizontal" class="mx-auto max-w-4xl">
         <template #body>
            <NuxtImg
               src="/img/form-banner.png"
               alt=""
               class="rounded-lg object-cover"
            />
         </template>

         <div>
            <h1 class="mb-12 flex justify-center text-heading-1">Login</h1>

            <UForm
               :state="state"
               class="space-y-4"
               @submit="emit('submit', { ...$event.data })"
            >
               <UFormField label="Email" name="email" required>
                  <UInput
                     v-model="state.email"
                     type="email"
                     autocomplete="username"
                     required
                     class="w-full"
                  />
               </UFormField>

               <UFormField label="Password" name="password" required>
                  <UInput
                     v-model="state.password"
                     type="password"
                     autocomplete="current-password"
                     required
                     class="w-full"
                  />
               </UFormField>

               <UButton
                  block
                  type="submit"
                  variant="solid"
                  color="primary"
                  class="mt-4"
                  >Log in</UButton
               >

               <USeparator> or </USeparator>

               <UButton
                  type="button"
                  icon="logos:google-icon"
                  variant="outline"
                  block
                  class="py-4 bg-elevated"
                  @click="emit('googleSignIn')"
               >
                  Log in with Google
               </UButton>
            </UForm>

            <p class="text-center mt-4">
               if you don't have an account,
               <a class="text-link text-info" href="/account/register">
                  register here
               </a>
            </p>
         </div>
      </UPageCard>
   </UContainer>
</template>

<script setup lang="ts">
const state = reactive({ email: "", password: "" });

const emit = defineEmits<{
   submit: [credentials: typeof state];
   googleSignIn: [];
}>();
</script>

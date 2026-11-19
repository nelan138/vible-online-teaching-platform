<template>
   <UPageCard
      :orientation="image ? 'horizontal' : 'vertical'"
      :class="image ? 'max-w-3xl' : 'max-w-md'"
      :ui="{ container: image ? undefined : 'justify-center lg:flex' }"
      class="mx-auto my-8 min-h-[67dvh] w-full"
   >
      <NuxtImg
         v-if="image"
         :src="image"
         alt=""
         class="h-full rounded-sm"
      />

      <UAuthForm v-bind="form">
         <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
         </template>
      </UAuthForm>
   </UPageCard>
</template>

<script setup lang="ts">
import type { AuthFormProps } from '@nuxt/ui';

defineProps<{
   form: AuthFormProps;
   image?: string | false;
}>();
</script>

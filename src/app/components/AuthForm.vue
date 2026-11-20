<template>
   <UPageCard :ui="{ container: 'justify-center lg:flex' }" class="mx-auto my-8 w-full max-w-sm">
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
}>();
</script>

<template>
   <UBlogPost
      :description="description"
      :badge="badge"
      :image="image"
      :ui="{
         header: 'aspect-[14/3]',
         meta: 'absolute top-2 right-2 z-10 mb-0',
      }"
      :authors="[{ name: 'Teacher: ' + author.name, to: author.to }]"
   >
      <template #title>
         <NuxtLink :to="to" class="text-link">{{ title }}</NuxtLink>
      </template>
   </UBlogPost>
</template>

<script setup lang="ts">
import type { BadgeProps } from "@nuxt/ui";

defineProps<{
   title: string;
   to: string;
   description?: string;
   badge?: BadgeProps;
   image?: string;
   author: {
      name: string;
      to?: string;
   };
}>();
</script>

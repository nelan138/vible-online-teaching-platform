<template>
   <div
      class="relative flex items-center justify-center overflow-hidden bg-(--ui-bg-muted)/50 p-4"
   >
      <svg
         class="pointer-events-none absolute inset-0 size-full stroke-(--ui-border-accented)/50"
         fill="none"
      >
         <defs>
            <pattern
               :id="id"
               width="10"
               height="10"
               patternUnits="userSpaceOnUse"
            >
               <path d="M-3 3L3 -3M0 10L10 0M7 13L13 7" stroke-width="1" />
            </pattern>
         </defs>
         <rect width="100%" height="100%" :fill="`url(#${id})`" />
      </svg>

      <div class="relative z-10 text-sm font-medium text-muted">
         <slot />
      </div>
   </div>
</template>

<script setup lang="ts">
const id = useId();
</script>

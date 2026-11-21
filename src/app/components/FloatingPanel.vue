<template>
   <UDropdownMenu class="fixed bottom-8 right-8 z-1000" :content="{ side: 'top', align: 'end' }">
      <template #default="{ open }">
         <UButton
            :icon="open ? 'lucide:x' : 'lucide:paw-print'"
            :color="open ? 'primary' : 'neutral'"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            class="p-4 data-[state=open]:rounded-full"
         />
      </template>

      <template #content-top>
         <div
            class="flex gap-2 mb-2 flex-col [&>:is(button,a[data-slot=base])]:w-fit [&>:is(button,a[data-slot=base])]:p-4 [&>:is(button,a[data-slot=base])]:rounded-3xl [&>:is(button,a[data-slot=base])]:self-end"
         >
            <slot />
         </div>
      </template>
   </UDropdownMenu>
</template>

<script setup lang="ts"></script>

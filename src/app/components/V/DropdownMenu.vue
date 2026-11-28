<template>
   <UDropdownMenu
      class="fixed right-[max(0px,(100%-var(--ui-container))/2)] bottom-4 z-100 mr-4 sm:mr-6 lg:mr-8 lg:mb-12"
      :ui="{ content: 'overflow-visible bg-transparent shadow-none ring-0' }"
      :content="{
         align: 'end',
         side: 'top',
      }"
   >
      <template #content-top>
         <div class="mb-2 flex flex-col items-end gap-2 *:rounded-3xl *:p-4">
            <slot />
         </div>
      </template>

      <template #default="{ open }">
         <UButton
            icon="lucide:plus"
            variant="solid"
            color="primary"
            size="lg"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            class="p-4 transition-transform duration-200 motion-reduce:transition-none"
            :class="{ '-rotate-45 rounded-full bg-inverted': open }"
         />
      </template>
   </UDropdownMenu>
</template>

<script setup lang="ts"></script>

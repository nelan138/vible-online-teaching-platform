<template>
   <UFooter
      :ui="{
         top: 'pt-5 pb-0 lg:pt-5 lg:pb-0',
         container: 'max-w-none lg:px-[3.75%] lg:py-6',
         right: 'gap-4',
      }"
   >
      <template #top>
         <USeparator>
            <UIcon
               name="logos:nuxt-icon"
               class="footer-mark h-5 w-6"
               aria-hidden="true"
            />
         </USeparator>
      </template>

      <template #left>
         <p class="text-muted text-sm">
            Published under <span class="text-highlighted">MIT License</span>
         </p>
      </template>

      <ul class="flex items-center gap-5 text-sm font-medium text-muted">
         <li
            v-for="label in ['Community', 'Contribution', 'Team']"
            :key="label"
         >
            {{ label }}
         </li>
      </ul>

      <template #right>
         <UIcon
            v-for="icon in [
               'nuxt-icon',
               'discord-icon',
               'x',
               'bluesky',
               'github-icon',
            ]"
            :key="icon"
            :name="'logos:' + icon"
            class="footer-mark size-5"
            aria-hidden="true"
         />
      </template>
   </UFooter>
</template>

<style scoped>
.footer-mark {
   filter: brightness(0) opacity(0.75);
}

.dark .footer-mark {
   filter: brightness(0) invert(1) opacity(0.8);
}
</style>

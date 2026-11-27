<template>
   <NuxtImg
      src="/img/page-hero.png"
      alt=""
      width="1918"
      height="883"
      class="page-hero block aspect-3/1 h-auto object-cover"
   />
</template>

<style scoped>
.page-hero {
   width: 100vw;
   max-width: none;
   /* Center the viewport-wide image inside the narrower content column. */
   margin-inline: calc(50% - 50vw);
}
</style>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   modules: [
      "@nuxt/image",
      "@nuxt/ui",
      "@nuxt/eslint",
      "@nuxt/test-utils/module",
      "@pinia/nuxt",
   ],
   css: ["~/assets/css/main.css"],
   compatibilityDate: "2025-07-15",
   devtools: { enabled: false },
});

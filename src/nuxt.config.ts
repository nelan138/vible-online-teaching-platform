// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/eslint", "@pinia/nuxt"],
   css: ["~/assets/css/main.css"],
   fonts: {
      families: [{ name: "Kalam", provider: "none" }],
   },
   compatibilityDate: "2025-07-15",
   devtools: { enabled: false },
});

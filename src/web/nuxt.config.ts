// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})

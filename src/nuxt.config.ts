// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/test-utils/module', '@nuxt/ui', '@nuxt/image', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})

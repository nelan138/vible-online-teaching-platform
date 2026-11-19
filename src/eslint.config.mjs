// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['app/components/Placeholder.vue'],
  rules: {
    'vue/multi-word-component-names': ['error', { ignores: ['Placeholder'] }],
  },
})

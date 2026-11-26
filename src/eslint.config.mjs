import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['app/layouts/**/*.vue'],
  rules: {
    'vue/no-multiple-template-root': 'error',
  },
})

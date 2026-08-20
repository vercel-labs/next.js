import nextPlugin from '@next/eslint-plugin-next'

export default [
  { ignores: ['node_modules/**', '.next/**'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { '@next/next': nextPlugin },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
]

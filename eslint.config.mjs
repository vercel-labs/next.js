import next from '@next/eslint-plugin-next'
export default [{ files: ['fixtures/**/*.jsx'], plugins: { '@next/next': next }, languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { '@next/next/no-async-client-component': 'error' } }]

import next from 'eslint-config-next'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  ...next,
  {
    files: ['**/*.jsx'],
    plugins: { next: nextPlugin },
    rules: {
      // Rule referenced by the old docs section linked in issue #42159.
      'next/link-passhref': 'error',
    },
  },
]

module.exports = {
  root: '.',
  sources: { '.': 'repro' },
  excludes: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  projects: {
    repro: { output: '__generated__', language: 'typescript', schema: 'schema.graphql' },
  },
}

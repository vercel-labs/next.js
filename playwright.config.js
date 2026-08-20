module.exports = {
  testDir: '.',
  testMatch: 'csp.spec.js',
  use: { baseURL: 'http://localhost:3000' },
  reporter: [['list'], ['json', { outputFile: 'playwright-report.json' }]],
}

module.exports = {
  testDir: '.',
  testMatch: '**/test.spec.js',
  use: { baseURL: 'http://localhost:3000', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  outputDir: './test-results',
  reporter: [['list']],
  retries: 0,
}

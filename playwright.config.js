module.exports = {
  testDir: './tests',
  timeout: 60000,
  use: { baseURL: 'http://localhost:3000', screenshot: 'only-on-failure' },
  outputDir: './test-results',
  reporter: [['list']],
}

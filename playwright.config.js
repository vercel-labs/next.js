module.exports = {
  testDir: './tests',
  timeout: 60000,
  use: { baseURL: 'http://localhost:3100', screenshot: 'only-on-failure' },
  reporter: [['list']],
}

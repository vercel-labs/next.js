module.exports = {
  testDir: './tests',
  timeout: 300000,
  reporter: [['list']],
  use: { screenshot: 'only-on-failure', trace: 'retain-on-failure' },
}

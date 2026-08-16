module.exports = {
  testDir: './tests',
  timeout: 90000,
  use: { baseURL: 'http://localhost:3000', trace: 'on', screenshot: 'on' },
  reporter: [['list']],
  webServer: {
    command: 'npm run dev 2>&1 | tee next-dev.log',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120000,
  },
}

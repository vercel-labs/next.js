const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000', screenshot: 'only-on-failure', trace: 'off' },
  reporter: [['list']],
  outputDir: '/workspace/.next-maintainer/reproduction-artifacts/playwright',
});

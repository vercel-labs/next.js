import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  outputDir: '/workspace/.next-maintainer/reproduction-artifacts/playwright/output',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3111', screenshot: 'on', trace: 'on' },
})

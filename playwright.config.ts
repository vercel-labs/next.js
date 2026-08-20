import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000', viewport: { width: 1000, height: 800 } },
  reporter: [['list'], ['html', { outputFolder: '/workspace/.next-maintainer/reproduction-artifacts/playwright/report', open: 'never' }]],
  outputDir: '/workspace/.next-maintainer/reproduction-artifacts/playwright/test-results',
})

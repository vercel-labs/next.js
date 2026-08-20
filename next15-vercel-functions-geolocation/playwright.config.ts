import { defineConfig } from '@playwright/test'
export default defineConfig({
  webServer: { command: 'npx next dev -p 3001', url: 'http://localhost:3001', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:3001' },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
})

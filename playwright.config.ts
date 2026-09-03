import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: './playwright-report/report.json' }]],
  outputDir: './test-results',
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000', trace: 'off' },
})

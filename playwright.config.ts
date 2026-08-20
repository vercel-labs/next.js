import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: '.',
  testMatch: 'repro.spec.ts',
  use: { screenshot: 'only-on-failure', trace: 'off' },
  reporter: [['list']],
  outputDir: '/workspace/.next-maintainer/reproduction-artifacts/playwright',
})

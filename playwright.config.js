module.exports = {
  testDir: './tests',
  timeout: 60000,
  use: { baseURL: 'http://localhost:3000' },
  reporter: [['list'], ['html', { outputFolder: '/workspace/.next-maintainer/reproduction-artifacts/playwright/report', open: 'never' }]],
  outputDir: '/workspace/.next-maintainer/reproduction-artifacts/playwright/results',
};

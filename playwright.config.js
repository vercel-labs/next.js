module.exports = {
  testDir: './tests',
  reporter: [['list'], ['json', { outputFile: '../.next-maintainer/reproduction-artifacts/playwright/report.json' }]],
  outputDir: '../.next-maintainer/reproduction-artifacts/playwright/output',
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3002' },
};

module.exports = {
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000', screenshot: 'only-on-failure' },
  reporter: [['list']],
};

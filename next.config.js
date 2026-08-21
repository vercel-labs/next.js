/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    testProxy: process.env.USE_TEST_PROXY === '1',
  },
}

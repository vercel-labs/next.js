/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    testProxy: process.env.TEST_PROXY === '1',
  },
}

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    testProxy: process.env.ENABLE_TEST_PROXY === "true",
  },
};

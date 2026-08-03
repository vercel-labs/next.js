/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // Attaches next/dist/experimental/testmode interceptors to the server.
    testProxy: true,
  },
}

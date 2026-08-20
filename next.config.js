/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5328/api/:path*', // Proxy to Flask backend
      },
    ]
  },
}

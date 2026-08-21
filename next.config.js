/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/weatherforecast',
        destination: 'https://localhost:7248/weatherforecast',
      },
    ]
  },
}

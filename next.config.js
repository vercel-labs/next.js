/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [{ source: '/profile', destination: '/account', permanent: false }]
  },
}

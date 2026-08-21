/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      { source: '/go-hash-query', destination: 'https://www.example.com/#/login?return=something', permanent: false },
      { source: '/go-hash', destination: 'https://www.example.com/#/login', permanent: false },
      { source: '/go-escaped', destination: 'https://www.example.com/#/login\\?return=something', permanent: false },
    ]
  },
}

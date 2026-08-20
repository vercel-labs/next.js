/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' 'unsafe-inline'",
          },
        ],
      },
    ]
  },
}

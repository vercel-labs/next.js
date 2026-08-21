/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // strict: no 'unsafe-eval'. inline allowed so the app can hydrate,
            // isolating the eval() violation coming from next/dist/compiled/util
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
          },
        ],
      },
    ]
  },
}

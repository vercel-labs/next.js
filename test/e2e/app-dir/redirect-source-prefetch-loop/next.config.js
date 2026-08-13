/** @type {import('next').NextConfig} */
// Reproduction for https://github.com/vercel/next.js/issues/97329: the only
// non-default configuration is a `redirects()` rule whose source is a URL that
// also matches an existing dynamic route (`/products/[...slug]`).
module.exports = {
  async redirects() {
    return [
      {
        source: '/products/retired-1',
        destination: '/categories/wine/red',
        permanent: true,
      },
      {
        source: '/products/retired-2',
        destination: '/categories/wine/white',
        permanent: true,
      },
    ]
  },
}

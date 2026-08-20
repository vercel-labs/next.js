/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    const target = process.env.REDIRECT_TARGET || '/default'
    console.log('[next.config.js] redirects() evaluated, REDIRECT_TARGET =', target)
    return [{ source: '/go', destination: target, permanent: false }]
  },
}

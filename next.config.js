// ACAO="" (unset) -> no Access-Control-Allow-Origin header on any response.
// ACAO="http://localhost:3001" -> issue 59813's documented setup.
const acao = process.env.ACAO === undefined ? 'http://localhost:3001' : process.env.ACAO

module.exports = {
  // The Next.js app is served on :3000, the HTML is re-served on the foreign origin :3001,
  // so all assets (including the next/font/local woff2) are requested cross-origin.
  assetPrefix: 'http://localhost:3000',
  crossOrigin: process.env.CROSS_ORIGIN || undefined,
  async headers() {
    if (!acao) return []
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: acao }],
      },
    ]
  },
}

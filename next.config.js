/** Repro for https://github.com/vercel/next.js/issues/62133 */
module.exports = {
  experimental: {
    // Setting this makes Next.js run `history.scrollRestoration = 'manual'`,
    // which makes iOS WebKit render a blank snapshot during the swipe-back gesture.
    scrollRestoration: true,
  },
}

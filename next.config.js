// Reproduction for https://github.com/vercel/next.js/issues/42688
// Proxy rewrites to an external HTTPS destination.
const DEST = process.env.DEST || 'https://jsonplaceholder.typicode.com';

module.exports = {
  rewrites: async () => [
    { source: '/api/:path*', destination: `${DEST}/:path*`, basePath: false },
  ],
};

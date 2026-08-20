const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

// FIX=slash -> append a trailing slash to the rewrite destination (community workaround)
const destination =
  process.env.FIX === 'slash' ? `${BACKEND}/api/:path*/` : `${BACKEND}/api/:path*`;

/** @type {import('next').NextConfig} */
module.exports = {
  skipTrailingSlashRedirect: process.env.FIX === 'skip',
  rewrites: async () => [{ source: '/api/:path*', destination }],
};

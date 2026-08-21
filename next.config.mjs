/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // BUG TRIGGER: an absolute outputFileTracingRoot that does not contain this
  // project (e.g. a leftover local macOS path committed to the repo).
  // Build traces are then resolved against the wrong root, so almost no
  // `node_modules/next/dist/**` file is traced. On Vercel the resulting
  // lambda is missing `next/dist/compiled/source-map`, which
  // `server/node-environment-extensions/error-inspect.js` requires at
  // startup => every route/API route answers 500.
  // Comment the next line out to get a healthy build.
  outputFileTracingRoot: '/Users/avaish/Desktop/SLoP5.0',
};
export default nextConfig;

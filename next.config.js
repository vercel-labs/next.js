/** @type {import('next').NextConfig} */
const nextConfig = {
  // The page is served from 127.0.0.1 while chunks are served from localhost.
  // These are cross-site, so Chrome applies LowPriorityAsyncScriptExecution
  // without forcing the feature onto same-origin scripts.
  assetPrefix: 'http://localhost:4000',
};

module.exports = nextConfig;

/** @type {import("next").NextConfig} */
module.exports = {
  output: 'standalone',
  assetPrefix: process.env.CDN_URI ?? '',
};

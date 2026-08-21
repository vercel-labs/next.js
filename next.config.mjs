/** @type {import('next').NextConfig} */
const assetPrefix = process.env.ASSET_PREFIX || '';

export default {
  assetPrefix,
  allowedDevOrigins: ['localhost', '127.0.0.1'],
};

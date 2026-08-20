/** @type {import('next').NextConfig} */
export default {
  assetPrefix: 'https://cdn.example.com',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
  },
};

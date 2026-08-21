/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    qualities: [50, 75, 90, 100],
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
  },
}

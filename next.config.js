/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'vercelsolutions.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
    ],
  },
}

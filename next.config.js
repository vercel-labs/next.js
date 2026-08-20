/** Config copied verbatim from https://nextjs.org/docs/messages/next-image-unconfigured-host
 *  (only hostname/pathname changed to a real host) */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        port: '',
        pathname: '/image/**',
        search: '',
      },
    ],
  },
}

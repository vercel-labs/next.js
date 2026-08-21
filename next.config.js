/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "http://www.nextjsrocks.com/:path*",
        permanent: true,
        has: [{ type: "host", value: "nextjsrocks\\.com(:\\d+)?" }],
      },
      {
        source: "/old",
        destination: "/new",
        permanent: false,
      },
    ];
  },
};

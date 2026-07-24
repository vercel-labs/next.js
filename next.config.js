// The ONLY non-default config. Remove this file => the bug disappears.
module.exports = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }],
    }];
  },
};

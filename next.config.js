module.exports = {
  async redirects() {
    return [
      { source: "/url.", destination: "/url", permanent: true },
      { source: "/other", destination: "/url", permanent: true },
    ];
  },
};

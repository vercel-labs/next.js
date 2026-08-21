const nextConfig = {
  experimental: {
    swcPlugins: [
      [
        // absolute path, as returned by require.resolve()
        require.resolve("@swc/plugin-react-remove-properties"),
        { properties: ["^data-custom$"] },
      ],
    ],
  },
};

module.exports = nextConfig;

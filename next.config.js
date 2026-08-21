/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {
    rules: {
      "*.macro.js": {
        loaders: [require.resolve("./compilation-probe-loader.js")],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.macro\.js$/,
      use: [require.resolve("./compilation-probe-loader.js")],
    });
    return config;
  },
};

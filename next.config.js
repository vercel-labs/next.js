const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
    // Set NO_ALIAS=1 to disable the alias and see the app work correctly.
    if (!process.env.NO_ALIAS) {
      ["react", "react-dom"].forEach((item) => {
        config.resolve.alias[item] = path.resolve(
          __dirname,
          ".",
          "node_modules",
          item,
        );
      });
    }
    return config;
  },
};

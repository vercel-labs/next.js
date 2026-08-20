/** @type {import("next").NextConfig} */
module.exports = {
  cacheHandler: require.resolve("./cache-handler"),
  cacheMaxMemorySize: 0,
};

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    swcPlugins: [["comment-probe-plugin", {}]],
  },
};

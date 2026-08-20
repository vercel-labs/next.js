/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  generateBuildId: () => "release/v1",
};
module.exports = nextConfig;

/** @type {import('next').NextConfig} */
module.exports = {
  // Set NO_SERVER_MINIFY=1 to verify the workaround
  experimental: process.env.NO_SERVER_MINIFY ? { serverMinification: false } : {},
};

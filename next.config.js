const withPlugins = require('next-compose-plugins')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPlugins([], nextConfig)

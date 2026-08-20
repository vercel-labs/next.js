/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['dep'],
  experimental: {
    swcPlugins: [
      ['@swc/plugin-transform-imports', { lib: { transform: 'lib/{{member}}' } }],
    ],
  },
}
export default nextConfig

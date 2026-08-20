/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  reactStrictMode: false,
  images: { unoptimized: true },
}

export default nextConfig

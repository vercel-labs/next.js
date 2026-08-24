/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  compiler: { define: { __MY_FLAG__: false } },
}
export default nextConfig

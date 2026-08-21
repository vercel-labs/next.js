/** @type {import('next').NextConfig} */
const nextConfig = {
  // On Next 15.3.x this lives under `experimental`.
  // On Next 16 canary it is the top-level `reactCompiler: true`.
  experimental: { reactCompiler: true },
};
export default nextConfig;

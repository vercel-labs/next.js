import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino'],
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

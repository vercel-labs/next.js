import type { NextConfig } from 'next';

const nextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
} satisfies NextConfig;

export default nextConfig;

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Set to false to use the legacy TypeScript-API type checker,
  // which filters out diagnostics from __tests__/__mocks__ and *.test.*/*.spec.* files.
  experimental: { useTypeScriptCli: false },
}

export default nextConfig

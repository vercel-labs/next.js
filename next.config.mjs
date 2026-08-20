// Set USE_OFFLINE=1 to enable the canary-only `experimental.useOffline` flag,
// which makes the prefetch scheduler retry after connectivity is restored.
const nextConfig = process.env.USE_OFFLINE
  ? { experimental: { useOffline: true } }
  : {}
export default nextConfig

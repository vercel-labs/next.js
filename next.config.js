/** @type {import('next').NextConfig} */
module.exports = {
  cacheComponents: true,
  // Legacy top-level custom cache handler (used by ISR + `unstable_cache`).
  cacheHandler: require.resolve('./legacy-cache-handler.js'),
  experimental: {
    // Set USE_CACHE_HANDLERS=1 to also register a `use cache` handler.
    ...(process.env.USE_CACHE_HANDLERS
      ? { cacheHandlers: { default: require.resolve('./use-cache-handler.js') } }
      : {}),
  },
}

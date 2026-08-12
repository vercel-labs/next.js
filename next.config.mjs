export default {
  // more prerender workers + no in-memory cache layer, so every page hits the
  // on-disk fetch-cache directly (as it does on a big multi-worker build).
  experimental: { cpus: 16 },
  cacheMaxMemorySize: 0,
}

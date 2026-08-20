module.exports = {
  // Force the file-system ISR cache to be used for every request (no in-memory LRU).
  cacheMaxMemorySize: 0,
  experimental: { isrMemoryCacheSize: 0 },
};

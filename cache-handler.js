// Minimal custom ISR cacheHandler that intentionally holds nothing.
module.exports = class CacheHandler {
  constructor(options) { this.options = options }
  async get() { return null }
  async set() { /* discard */ }
  async revalidateTag() {}
  resetRequestCache() {}
}

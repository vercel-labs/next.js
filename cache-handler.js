const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }
  async get(key) {
    console.log('[cache-handler] get', key)
    return cache.get(key)
  }
  async set(key, data, ctx) {
    console.log('[cache-handler] set', key, 'tags=', JSON.stringify(ctx && ctx.tags))
    cache.set(key, { value: data, lastModified: Date.now() })
  }
  async revalidateTag(...tags) {
    console.log('[cache-handler] revalidateTag CALLED', JSON.stringify(tags))
  }
}

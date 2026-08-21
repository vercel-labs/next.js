const cache = new Map()
module.exports = class LegacyCacheHandler {
  constructor(options) {
    console.log('[legacy-cache-handler] constructed')
  }
  async get(key) {
    console.log('[legacy-cache-handler] get', key)
    return cache.get(key)
  }
  async set(key, data, ctx) {
    console.log('[legacy-cache-handler] set', key)
    cache.set(key, { value: data, lastModified: Date.now(), tags: ctx?.tags ?? [] })
  }
  async revalidateTag(tags) {
    console.log('[legacy-cache-handler] revalidateTag', tags)
  }
}

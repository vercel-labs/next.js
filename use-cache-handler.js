const cache = new Map()
module.exports = {
  async get(key) {
    console.log('[use-cache-handler] get', key)
    const entry = cache.get(key)
    if (!entry) return undefined
    const [saved, live] = entry.value.tee()
    entry.value = saved
    return { ...entry, value: live }
  },
  async set(key, pendingEntry) {
    console.log('[use-cache-handler] set', key)
    const entry = await pendingEntry
    cache.set(key, entry)
  },
  async refreshTags() {},
  async getExpiration() { return 0 },
  async expireTags() {},
}

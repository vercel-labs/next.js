// Minimal "shared" cache handler: a file-based store standing in for Redis.
// Both server processes read/write the SAME directory, like two containers
// sharing one Redis instance.
const fs = require('fs')
const path = require('path')

const DIR = process.env.SHARED_CACHE_DIR || path.join(__dirname, '.shared-cache')
fs.mkdirSync(DIR, { recursive: true })

const file = (key) => path.join(DIR, Buffer.from(key).toString('hex') + '.json')
const who = process.env.SERVER_NAME || process.pid

module.exports = class SharedCacheHandler {
  async get(key) {
    try {
      const data = JSON.parse(fs.readFileSync(file(key), 'utf8'))
      console.log(`[cache ${who}] GET hit  ${key}`)
      return data
    } catch {
      console.log(`[cache ${who}] GET miss ${key}`)
      return null
    }
  }
  async set(key, value, ctx) {
    console.log(`[cache ${who}] SET      ${key} ctx=${JSON.stringify(ctx)}`)
    fs.writeFileSync(
      file(key),
      JSON.stringify({ value, lastModified: Date.now(), tags: ctx && ctx.tags })
    )
  }
  async revalidateTag() {}
}

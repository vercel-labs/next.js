// Standalone proof of the recursion, without running a Next.js server.
// Attaches the same interceptor `experimental.testProxy` attaches
// (next/dist/experimental/testmode/server.js -> interceptHttpGet) and then
// makes one plain node:http request outside of any test context.
import http from 'node:http'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const version = require('next/package.json').version

const upstream = http.createServer((req, res) => {
  console.log('[upstream] received request')
  res.end('{"ok":true}')
})
await new Promise((r) => upstream.listen(0, r))
const port = upstream.address().port

let calls = 0
const realFetch = globalThis.fetch
// Count how many times the `!testInfo` passthrough branch re-enters fetch.
const countingFetch = (...args) => {
  calls++
  if (calls > 200) {
    console.log(
      `next@${version}: RECURSION — passthrough originalFetch() called ${calls} times for a single request; upstream never reached`
    )
    process.exit(1)
  }
  return realFetch(...args)
}

const { interceptHttpGet } = require('next/dist/experimental/testmode/httpget.js')
interceptHttpGet(countingFetch)

http
  .get(`http://127.0.0.1:${port}/api`, (res) => {
    let body = ''
    res.on('data', (c) => (body += c))
    res.on('end', () => {
      console.log(`next@${version}: OK ${res.statusCode} ${body} (originalFetch calls: ${calls})`)
      process.exit(0)
    })
  })
  .on('error', (e) => {
    console.log(`next@${version}: ERROR ${e.message} (originalFetch calls: ${calls})`)
    process.exit(1)
  })

setTimeout(() => {
  console.log(`next@${version}: TIMEOUT, request never settled (originalFetch calls: ${calls})`)
  process.exit(1)
}, 20000)

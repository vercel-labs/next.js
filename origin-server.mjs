// Upstream data source. Slow on purpose (1s) so we can tell whether Next.js
// blocks the request while revalidating (~1s) or serves stale instantly (~0ms).
import { createServer } from 'node:http'

let counter = 0
createServer(async (req, res) => {
  counter++
  const n = counter
  console.log(`[origin] hit #${n} at ${new Date().toISOString()}`)
  await new Promise((r) => setTimeout(r, 1000))
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ value: n, at: new Date().toISOString() }))
}).listen(4000, () => console.log('[origin] listening on 4000'))

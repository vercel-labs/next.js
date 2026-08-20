// Automated reproduction of https://github.com/vercel/next.js/issues/62920
// Requires: `npm install` and `npx next build` already done, or run `npm run repro` which does both.
import { spawn } from 'node:child_process'
import { once } from 'node:events'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = (...a) => console.log(...a)

const upstream = spawn('node', ['upstream-server.mjs'], { stdio: 'inherit' })
await sleep(500)

log('\n== next build ==')
const build = spawn('npx', ['next', 'build'], { stdio: 'inherit' })
await once(build, 'exit')

log('\n== next start ==')
const server = spawn('npx', ['next', 'start', '-p', '3000'], { stdio: 'inherit' })
for (let i = 0; i < 60; i++) {
  try {
    await fetch('http://127.0.0.1:3000/probe')
    break
  } catch {
    await sleep(500)
  }
}

const probe = async () => (await fetch('http://127.0.0.1:3000/probe?id=2')).json()

log('\n1. warm the fetch cache (upstream 200):', await probe())
await fetch('http://127.0.0.1:9099/admin/delete/2', { method: 'POST' })
log('2. product deleted upstream; upstream now answers 404')

for (let i = 1; i <= 10; i++) {
  await sleep(3000)
  const r = await probe()
  const page = await fetch('http://127.0.0.1:3000/products/2')
  log(`   t+${i * 3}s  fetch()=${r.upstreamStatus} body=${r.body}  page=/products/2 -> ${page.status}`)
}

log(
  '\nEXPECTED: after the 5s revalidate window the fetch should resolve to 404 and the page should render notFound() (404).'
)
log(
  'ACTUAL: fetch() keeps resolving with the stale 200 body forever, page keeps returning 200, even though the upstream log above shows Next.js DOES re-request and receives 404 every time.'
)

upstream.kill()
server.kill()
process.exit(0)

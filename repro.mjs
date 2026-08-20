// Runs origin + next dev, requests /rewrite, prints headers set by middleware.
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const mode = process.argv[2] === 'start' ? 'start' : 'dev'
const log = fs.openSync(`next-${mode}.log`, 'w')
const origin = spawn('node', ['origin.mjs'], { stdio: 'inherit' })
const next = spawn('npx', ['next', mode, '-p', '3000'], { stdio: ['ignore', log, log] })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function main() {
  for (let i = 0; i < 60; i++) {
    try { await fetch('http://localhost:3000/'); break } catch { await wait(1000) }
  }
  const res = await fetch('http://localhost:3000/rewrite', { redirect: 'manual' })
  const get = (h) => res.headers.get(h)
  console.log('\n--- GET /rewrite (' + mode + ') ---')
  console.log('status           :', res.status)
  console.log('custom           :', get('custom'), '  (expected from-middleware)')
  console.log('cache-control    :', get('cache-control'), '  (expected public, max-age=60)')
  console.log('server           :', get('server'), '  (expected from-middleware)')
  console.log('x-origin-only    :', get('x-origin-only'), '  (expected from-middleware)')
  const ok = get('cache-control') === 'public, max-age=60'
  console.log(ok ? '\nPASS: middleware cache-control honoured' : '\nBUG: middleware cache-control was NOT applied (origin/Next value won)')
  origin.kill(); next.kill(); process.exit(ok ? 0 : 1)
}
main()

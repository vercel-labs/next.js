// Drives the reproduction for vercel/next.js#82315:
// repeatedly edits app/page.tsx (triggering HMR) while polling an existing
// app route. Any non-200 response is the bug (404 from a route that exists).
import fs from 'node:fs'

const base = process.env.BASE ?? 'http://localhost:3000'
const iterations = Number(process.env.ITERATIONS ?? 5)
const target = process.env.TARGET ?? '/route-199'
const file = new URL('../app/page.tsx', import.meta.url).pathname

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(path) {
  const res = await fetch(base + path, { headers: { 'x-repro': '1' } })
  await res.text()
  return res.status
}

// warm up
for (let i = 0; i < 20; i++) {
  if ((await get(target).catch(() => 0)) === 200) break
  await sleep(1000)
}
console.log('server ready, starting', iterations, 'HMR iterations')

const bad = []
for (let i = 1; i <= iterations; i++) {
  fs.writeFileSync(file, `export default function Page() {\n  return <p>home v${i}</p>\n}\n`)
  // poll aggressively during recompilation, like the browser reload does
  const deadline = Date.now() + 8000
  while (Date.now() < deadline) {
    const statuses = await Promise.all(
      Array.from({ length: 8 }, () => get(target).catch((e) => String(e)))
    )
    for (const status of statuses) {
      if (status !== 200) {
        bad.push({ iteration: i, status })
        console.log(`iteration ${i}: GET ${target} -> ${status}`)
      }
    }
  }
  console.log(`iteration ${i} done (${bad.length} non-200 so far)`)
}
console.log(JSON.stringify({ iterations, non200: bad.length, samples: bad.slice(0, 20) }, null, 2))
process.exit(bad.length > 0 ? 1 : 0)

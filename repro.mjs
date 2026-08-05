// Repro for https://github.com/vercel/next.js/issues/96705
// Usage:
//   npm install --legacy-peer-deps
//   npx next dev --port 3005        (in another shell)
//   node repro.mjs                  (needs `npm i -D playwright && npx playwright install chromium`)
import { chromium } from 'playwright'
import fs from 'fs'
import { execSync } from 'child_process'

const PORT = process.env.PORT || 3005
const FILE = 'app/[scope]/[locale]/page.tsx'
const ssr = () =>
  execSync(`curl -s -L localhost:${PORT}`).toString().match(/PROBE-[a-z0-9-]+/)?.[0]
const edit = (v) =>
  fs.writeFileSync(FILE, fs.readFileSync(FILE, 'utf8').replace(/PROBE-[a-z0-9-]+/, 'PROBE-' + v))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Phase A: no browser has ever connected -> every edit is applied to SSR
for (const v of ['a1', 'a2']) {
  edit(v)
  await wait(6000)
  console.log(`no browser   edit ${v} -> ssr=${ssr()}`)
}

// Phase B: connect a real browser once (HMR client), then keep editing
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' })
console.log('browser connected, sees:', (await page.content()).match(/PROBE-[a-z0-9-]+/)?.[0])

for (const v of ['b1', 'b2', 'b3']) {
  edit(v)
  await wait(7000)
  console.log(
    `with browser edit ${v} -> ssr=${ssr()} client=${(await page.content()).match(/PROBE-[a-z0-9-]+/)?.[0]}`
  )
}
await browser.close()
console.log('file on disk now:', fs.readFileSync(FILE, 'utf8').match(/PROBE-[a-z0-9-]+/)?.[0])
try {
  console.log(
    'SSR chunks on disk containing the latest value:\n' +
      execSync(`grep -rl "PROBE-b3" .next/dev/server/chunks/ssr | head -3`).toString()
  )
} catch {}

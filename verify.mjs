// Requires: npm run build:a && npm run build:b
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

async function run({ stale }) {
  const srv = spawn(process.execPath, ['static-host.js'], {
    env: { ...process.env, STALE: stale ? '1' : '0' },
    stdio: 'inherit',
  })
  await new Promise((r) => setTimeout(r, 800))
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const events = []
  page.on('response', (r) => events.push(`  net  ${r.status()} ${r.url()}`))
  page.on('framenavigated', (f) => {
    if (f === page.mainFrame()) events.push(`  NAV  ${f.url()}`)
  })
  await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.click('a')
  await page.waitForTimeout(3000)
  console.log(`\n=== prefetch .txt served ${stale ? 'STALE (deploy A cached)' : 'fresh (deploy B)'} ===`)
  console.log(events.filter((e) => !e.includes('/_next/static/chunks/')).join('\n'))
  console.log('  body:', (await page.textContent('body')).trim().slice(0, 40))
  console.log('  chunk requests after click:', events.filter((e) => e.includes('/chunks/')).length)
  await browser.close()
  srv.kill()
  await new Promise((r) => setTimeout(r, 500))
}

await run({ stale: false })
await run({ stale: true })

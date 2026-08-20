import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell' })
const p = await (await b.newContext({ viewport: { width: 800, height: 600 } })).newPage()

async function run(target, label) {
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await p.waitForFunction(() => window.__frames)
  await p.evaluate(() => { window.__frames.length = 0 })
  await p.click(`a[href="${target}"]`)
  await p.waitForTimeout(300)
  await p.screenshot({ path: `${OUT}/${label}-mid-navigation.png` })
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${label}-settled.png` })
  const frames = await p.evaluate(() => window.__frames)
  console.log(`\n=== navigate to ${target} (${label}) ===`)
  for (const f of frames) console.log(`+${f.t}ms  ${f.text}`)
}

await run('/dyn', 'next-dynamic')
await run('/lazy', 'react-lazy')
await b.close()

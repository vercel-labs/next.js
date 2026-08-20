// Automated reproduction of https://github.com/vercel/next.js/issues/63918
//
// 1. Finds the client chunk that contains the `next/dynamic` imported <Foo /> component.
// 2. Starts `next start`.
// 3. Loads `/` in Chromium with that single chunk request aborted (simulating a flaky network).
// 4. Prints the resulting console errors and the visible page text.
//
// Usage: npm run build && npm run verify
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const chunkDir = path.join('.next', 'static', 'chunks')
const files = fs.readdirSync(chunkDir).filter((f) => f.endsWith('.js'))
const fooChunk = files.find((f) => {
  const src = fs.readFileSync(path.join(chunkDir, f), 'utf8')
  return src.includes('children:"Foo"') || src.includes('>Foo<')
})

if (!fooChunk) {
  throw new Error('Could not find the dynamic chunk for <Foo />. Did you run `npm run build`?')
}
console.log('dynamic chunk for <Foo />:', fooChunk)

const port = process.env.PORT || '3000'
const server = spawn('npx', ['next', 'start', '-p', port], { stdio: ['ignore', 'inherit', 'inherit'] })

const baseUrl = `http://localhost:${port}/`
for (let i = 0; i < 60; i++) {
  try {
    const res = await fetch(baseUrl)
    if (res.ok) break
  } catch {}
  await new Promise((r) => setTimeout(r, 500))
}

const browser = await chromium.launch()
const page = await browser.newPage()
const logs = []
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))
await page.route(`**/chunks/${fooChunk}`, (route) => {
  logs.push(`[blocked] ${route.request().url()}`)
  return route.abort()
})

await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

console.log('\n--- browser logs ---\n' + logs.join('\n'))
console.log('\n--- visible page text ---\n' + (await page.locator('body').innerText()))
await page.screenshot({ path: 'chunk-load-error.png', fullPage: true })

await browser.close()
server.kill('SIGTERM')

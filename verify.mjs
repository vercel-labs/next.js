// Automated check for vercel/next.js#73803
// 1. start `next dev`, open /dashboard/1/1, click a card -> expect the intercepted MODAL
// 2. rename the intercepted segment (audit -> auditt, both folders + the <Link href>) while dev is running
// 3. click the card again -> BUG: full page instead of the modal (no dev-server restart)
// 4. restart dev -> the modal is back
import { spawn } from 'node:child_process'
import { rename, readFile, writeFile, rm } from 'node:fs/promises'
import { chromium } from 'playwright'

const ROOT = new URL('.', import.meta.url).pathname
const PAGE = `${ROOT}app/dashboard/[team]/[appId]/page.tsx`
const dirs = (s) => [
  `${ROOT}app/dashboard/[team]/${s}`,
  `${ROOT}app/dashboard/[team]/[appId]/@modal/(..)${s}`,
]

function startDev() {
  const p = spawn('npx', ['next', 'dev', '--turbo'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], detached: true })
  p.stdout.pipe(process.stdout)
  p.stderr.pipe(process.stderr)
  return new Promise((res) => {
    const wait = async () => {
      try {
        const r = await fetch('http://localhost:3000/dashboard/1/1')
        if (r.ok) return res(p)
      } catch {}
      setTimeout(wait, 1000)
    }
    wait()
  })
}

async function stopDev(p) {
  try { process.kill(-p.pid, 'SIGKILL') } catch {}
  for (let i = 0; i < 30; i++) {
    try { await fetch('http://localhost:3000/'); await new Promise((r) => setTimeout(r, 1000)) } catch { return }
  }
}

async function waitForServer(timeoutMs = 60000) {
  const end = Date.now() + timeoutMs
  while (Date.now() < end) {
    try {
      const r = await fetch('http://localhost:3000/dashboard/1/1')
      if (r.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('dev server did not come back on :3000')
}

async function clickCard(browser, seg) {
  await waitForServer()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/dashboard/1/1', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('a.card', { timeout: 60000 })
  await page.waitForTimeout(1000)
  await page.click('a.card >> nth=0')
  await page.waitForTimeout(2500)
  const modal = (await page.locator('dialog.modal').count()) > 0
  console.log(`[${seg}] url=${page.url()} intercepted(modal)=${modal}`)
  await page.close()
  return modal
}

async function renameSegment(from, to) {
  const [a, b] = dirs(from)
  const [c, d] = dirs(to)
  await rename(a, c)
  await rename(b, d)
  await writeFile(PAGE, (await readFile(PAGE, 'utf8')).replaceAll(`/${from}?photoId`, `/${to}?photoId`))
  await new Promise((r) => setTimeout(r, 8000)) // let dev pick up the change
}

try {
  await fetch('http://localhost:3000/')
  console.error('Port 3000 is already in use — stop it first.')
  process.exit(2)
} catch {}

await rm(`${ROOT}.next`, { recursive: true, force: true })
let dev, browser, before, afterRename, afterRestart
try {
  dev = await startDev()
  browser = await chromium.launch()
  before = await clickCard(browser, 'audit (initial)')
  await renameSegment('audit', 'auditt')
  afterRename = await clickCard(browser, 'auditt (after rename, no restart)')
  await stopDev(dev)
  dev = await startDev()
  afterRestart = await clickCard(browser, 'auditt (after dev restart)')
} finally {
  await browser?.close()
  if (dev) await stopDev(dev)
  await renameSegment('auditt', 'audit').catch(() => {})
}

console.log('\nintercepted before rename       :', before, '(expected true)')
console.log('intercepted after rename       :', afterRename, '(expected true, BUG when false)')
console.log('intercepted after dev restart  :', afterRestart, '(expected true)')
process.exit(before && !afterRename && afterRestart ? 0 : 1)

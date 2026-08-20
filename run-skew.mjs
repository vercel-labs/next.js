import { chromium } from 'playwright'
import { spawn, execSync } from 'node:child_process'
import fs from 'node:fs'


const ART = process.env.ART_DIR || 'logs'
fs.mkdirSync(ART + '/next-server', { recursive: true })
fs.mkdirSync(ART + '/playwright', { recursive: true })
const KEEP_OLD_ASSETS = process.argv.includes('--keep-old-assets')
const ACTION = process.argv[2] || 'formsubmit'

function startServer(version, logName) {
  try { execSync('pkill -9 -f ' + ['next','server'].join('-')) } catch {}
  execSync(`rm -rf .next && cp -r .next-${version} .next`)
  if (KEEP_OLD_ASSETS && version === 'v2') {
    execSync(`cp -rn .next-v1/static/. .next/static/ || true`)
  }
  const log = fs.openSync(`${ART}/next-server/${logName}`, 'w')
  const p = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3000'], { stdio: ['ignore', log, log], detached: true })
  return p
}
async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch('http://localhost:3000/'); if (r.ok) return } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('server not up')
}

let server = startServer('v1', `server-v1-${ACTION}.log`)
await waitUp()

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + e.stack))
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
page.on('requestfailed', r => errors.push('requestfailed: ' + r.url() + ' ' + r.failure()?.errorText))
page.on('response', async r => { if (r.status() >= 400) errors.push('http ' + r.status() + ' ' + r.url())
  if (r.request().method() === 'POST' || r.url().includes('_rsc')) { try { const t = await r.text(); console.log('>>> ' + r.request().method() + ' ' + r.url() + ' status ' + r.status() + '\n' + t.slice(0, 2000)) } catch {} } })

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
console.log('loaded v1:', await page.textContent('h1'))

// deploy v2
try { process.kill(-server.pid, 'SIGKILL') } catch {}
try { execSync('pkill -9 -f ' + ['next','server'].join('-')) } catch {}
await new Promise(r => setTimeout(r, 2000))
try { await fetch('http://localhost:3000/'); console.log('WARNING: old server still up') } catch { console.log('v1 server stopped') }
server = startServer('v2', `server-v2-${ACTION}.log`)
await waitUp()
console.log('deployed v2; old tab still open. keepOldAssets =', KEEP_OLD_ASSETS)

await page.click('#' + ACTION)
await page.waitForTimeout(6000)
await page.screenshot({ path: `${ART}/playwright/skew-${ACTION}${KEEP_OLD_ASSETS ? '-keepassets' : ''}.png`, fullPage: true })
console.log('after click url:', page.url())
console.log('page body:', (await page.textContent('body')).slice(0, 300))
console.log('--- errors ---')
console.log(errors.join('\n') || '(none)')
await browser.close()
try { process.kill(-server.pid, 'SIGKILL') } catch {}

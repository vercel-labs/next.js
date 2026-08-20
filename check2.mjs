import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell' })
const p = await (await b.newContext()).newPage()
const errs = []
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)) })
await p.goto('http://localhost:3001/dyn-loading-null', { waitUntil: 'networkidle' })
await p.waitForTimeout(2000)
console.log('body:', (await p.innerText('body')).replace(/\s+/g,' ').slice(0,200))
console.log('errors:', JSON.stringify(errs, null, 1))
await b.close()

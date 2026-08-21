import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell' })
const p = await b.newPage()
await p.goto('http://localhost:3000/')
await p.click('text=go to client page')
await p.waitForSelector('#target')
console.log('final url:', p.url())
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/client-redirect.png' })
await b.close()

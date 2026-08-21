import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage()
const logs = []
page.on('console', (m) => logs.push(`[console:${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push('[pageerror] ' + e.message))
await page.addInitScript(() => {
  document.addEventListener('securitypolicyviolation', (e) => {
    console.warn(`CSP VIOLATION: ${e.violatedDirective} | ${e.blockedURI} | source=${e.sourceFile}:${e.lineNumber} | sample=${e.sample}`)
  })
})
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2000)
console.log('CSP header:', (await (await page.request.get('http://localhost:3000/')).headers())['content-security-policy'])
console.log('#status:', await page.locator('#status').textContent().catch(() => 'N/A'))
console.log(logs.join('\n') || '(no logs)')
await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/csp-violation.png', fullPage: true })
await browser.close()

import { chromium } from 'playwright'

const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage()
page.on('console', (m) => console.log('[browser]', m.text()))

await page.goto(base, { waitUntil: 'networkidle' })
console.log('1. initial body:', JSON.stringify((await page.locator('body').innerText()).trim()))
await page.screenshot({ path: `${OUT}/1-initial.png` })

// toggle true -> false : expect 404
await page.getByRole('button', { name: /^Toggle/ }).click()
await page.waitForTimeout(3000)
console.log('2. after toggle->false body:', JSON.stringify((await page.locator('body').innerText()).trim()))
await page.screenshot({ path: `${OUT}/2-after-notfound.png` })

// toggle false -> true : expect page to render "Home" again
await page.getByRole('button', { name: /^Toggle/ }).click()
await page.waitForTimeout(3000)
const body = (await page.locator('body').innerText()).trim()
console.log('3. after toggle->true body:', JSON.stringify(body))
await page.screenshot({ path: `${OUT}/3-after-refresh.png` })

console.log(body.includes('Home') ? 'RESULT: recovered (not reproduced)' : 'RESULT: still 404 after refresh (reproduced)')

// hard reload proves server now renders Home
await page.reload({ waitUntil: 'networkidle' })
console.log('4. after hard reload body:', JSON.stringify((await page.locator('body').innerText()).trim()))
await page.screenshot({ path: `${OUT}/4-after-hard-reload.png` })
await browser.close()

import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:3001'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
const read = () => page.evaluate(() => (window.__vtLog ??= []).splice(0))
const boxWidth = () => page.evaluate(() => document.getElementById('box')?.getBoundingClientRect().width)

await page.goto(BASE + '/')
await page.waitForSelector('#box')
await read()

// 1) Link navigation home -> /detail
await page.click('#to-detail')
await page.waitForSelector('h1:text("Detail")')
await page.waitForTimeout(1200)
const linkForward = { log: await read(), boxWidth: await boxWidth() }

// 2) Browser back (popstate) /detail -> home
await page.goBack()
await page.waitForSelector('h1:text("Home")')
await page.waitForTimeout(1200)
const popstateBack = { log: await read(), boxWidth: await boxWidth() }

// 3) Link navigation back (control) home -> /detail -> home via Link
await page.click('#to-detail')
await page.waitForSelector('h1:text("Detail")')
await page.waitForTimeout(1200)
await read()
await page.click('#to-home')
await page.waitForSelector('h1:text("Home")')
await page.waitForTimeout(1200)
const linkBack = await read()

// 4) Browser forward (popstate)
await page.goForward()
await page.waitForTimeout(1200)
const popstateForward = await read()

console.log(JSON.stringify({ linkForward, popstateBack, linkBack, popstateForward }, null, 2))
await page.screenshot({ path: OUT + '/final.png' })
await browser.close()

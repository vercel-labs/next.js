import { chromium } from 'playwright'
const shots='/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch(); const p = await b.newPage()
const st = async (l) => { console.log(`${l}: url=${p.url()} dialog=${await p.locator('[role=dialog], dialog').count()} imgs=${await p.locator('img').count()}`); await p.screenshot({path:`${shots}/nextgram-${l}.png`, fullPage:false}) }
await p.goto('https://nextgram.vercel.app/?example=21', {waitUntil:'load'})
await p.waitForTimeout(3000); await st('1-home')
const links = p.locator('a[href*="/photos/"]')
console.log('links', await links.count())
await links.first().click(); await p.waitForTimeout(3000); await st('2-softnav')
await p.reload({waitUntil:'load'}); await p.waitForTimeout(3000); await st('3-reload')
await p.goBack(); await p.waitForTimeout(3000); await st('4-back')
await p.locator('a[href*="/photos/"]').nth(1).click(); await p.waitForTimeout(3000); await st('5-softnav-again')
console.log(await p.content().then(c=>c.length))
await b.close()

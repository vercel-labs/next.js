import puppeteer from 'puppeteer'
const ROUTES = ['a','b','c','d']
const N = Number(process.env.PARALLEL ?? 4)
const ITER = Number(process.env.ITERATIONS ?? 10)
const HEADLESS = process.env.HEADLESS !== '0'
const browser = await puppeteer.launch({
  args: ['--no-startup-window','--disable-web-security','--force-color-profile=srgb','--no-sandbox','--disable-setuid-sandbox','--ignore-certificate-errors'],
  waitForInitialPage: false, headless: HEADLESS, devtools: !HEADLESS, acceptInsecureCerts: true
})
const ctx = await browser.createBrowserContext()
const pages = await Promise.all(Array.from({length:N},()=>ctx.newPage()))
const errs = []
for (const page of pages) {
  page.on('pageerror', e => errs.push(e.message))
  page.on('console', m => { const t=m.text(); if(m.type()==='error' && /Hydration failed|didn't match/.test(t)) errs.push(t) })
}
const free=[...pages]
const getPage=()=>new Promise(r=>{const i=setInterval(()=>{if(free.length){clearInterval(i);r(free.shift())}},100)})
async function testRoute(route){
  const page=await getPage()
  page.evaluate(`window.next.router.push('/${route}')`).catch(()=>page.goto('http://localhost:3000/'+route))
  await page.waitForNetworkIdle({timeout:30000, idleTime:600}).catch(()=>{})
  free.push(page)
}
for(let i=0;i<ITER;i++){ await Promise.allSettled(ROUTES.map(testRoute)); if(errs.length) break }
console.log(`parallel=${N} headless=${HEADLESS} errors=${errs.length}`)
for(const e of errs.slice(0,2)) console.log('---\n'+e.slice(0,3000))
await browser.close()
process.exit(errs.length?1:0)

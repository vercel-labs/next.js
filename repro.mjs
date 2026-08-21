// Simulates Safari session-restore: after quit/reopen, Safari restores history.state
// only for the *current* entry; older entries come back with state === null.
// We emulate that by nulling the state of the entry we are about to leave, then
// pressing Back (popstate fires with state === null), exactly like Safari does.
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = process.env.OUT_DIR || '/workspace/.next-maintainer/reproduction-artifacts/playwright'

const cases = [
  { name: 'app-router', home: '/', homeText: 'App Home', link: 'Route 1', next: '/route-1', nextText: 'App Route 1' },
  { name: 'pages-router', home: '/pages-home', homeText: 'Pages Home', link: 'Route 1', next: '/pages-route-1', nextText: 'Pages Route 1' },
]

const browser = await chromium.launch()
let failures = 0
for (const c of cases) {
  const page = await browser.newPage()
  await page.goto(BASE + c.home, { waitUntil: 'networkidle' })
  console.log(`\n== ${c.name} ==`)
  console.log('home heading:', await page.textContent('#page'))
  // emulate Safari dropping the state of the entry that will become "previous"
  // Safari hands back a *null* state. Next.js patches history.replaceState and
  // re-injects its internal state, so use a pristine History.prototype from an
  // iframe realm to truly clear the state of this entry.
  const nulled = await page.evaluate(() => {
    const f = document.createElement('iframe')
    document.body.appendChild(f)
    f.contentWindow.History.prototype.replaceState.call(history, null, '', location.href)
    f.remove()
    return history.state
  })
  console.log('state of entry left behind:', JSON.stringify(nulled))
  await page.getByRole('link', { name: c.link, exact: true }).click()
  await page.waitForURL(BASE + c.next)
  await page.waitForTimeout(500)
  console.log('after forward nav ->', page.url(), '|', await page.textContent('#page'))
  await page.goBack()
  await page.waitForTimeout(1500)
  const url = page.url()
  const heading = await page.textContent('#page')
  console.log('after Back        ->', url, '|', heading)
  await page.screenshot({ path: `${OUT}/${c.name}-after-back.png`, fullPage: true })
  const stuck = heading.trim() === c.nextText && url === BASE + c.home
  console.log(stuck
    ? `BUG: URL is ${c.home} but content is still "${c.nextText}"`
    : `OK: content is "${heading.trim()}" at ${url}`)
  if (stuck) failures++
  await page.close()
}
await browser.close()
console.log(`\n${failures} of ${cases.length} routers stuck after null-state popstate`)
process.exit(failures ? 1 : 0)

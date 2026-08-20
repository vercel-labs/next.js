import { chromium } from 'playwright'
const port = process.env.PORT || '3000'
const base = `http://localhost:${port}`
const OUT = process.env.OUT || '.'
const b = await chromium.launch({ executablePath: process.env.CHROME })
const p = await b.newPage()
const read = async () => `router.query.q=${await p.textContent('#query')} asPath=${await p.textContent('#aspath')} url=${p.url()}`
async function run(name, links) {
  await p.goto(base + '/?q=0'); await p.waitForTimeout(700)
  console.log(`\n[${name}] start: ${await read()}`)
  for (const id of links) {
    await p.locator('#' + id).dispatchEvent('click'); await p.waitForTimeout(900)
    console.log(`  click #${id} -> ${await read()}`)
  }
  await p.screenshot({ path: `${OUT}/${name}.png` })
}
await run('with-anchor-in-as', ['bug-1', 'bug-2'])
await run('without-anchor-in-as', ['ok-1', 'ok-2'])
await b.close()

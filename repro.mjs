// Automated check: npm run build && npm start, then `node repro.mjs`
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => console.log('  [page]', m.text()));
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

await page.click('#pending'); // unrelated async transition, pending for 8s
await page.waitForTimeout(300);

const before = await page.textContent('#value');
const t0 = Date.now();
await page.click('#act', { noWaitAfter: true }); // server action + router.refresh()

let applied = null;
let clicked = false;
while (Date.now() - t0 < 15000) {
  if (process.env.FORCE_CLICK && !clicked && Date.now() - t0 > 400) {
    clicked = true;
    await page.click('#unrelated', { noWaitAfter: true });
  }
  if ((await page.textContent('#value')) !== before) {
    applied = Date.now() - t0;
    break;
  }
  await new Promise((r) => setTimeout(r, 10));
}
console.log(`\nnew server value applied ${applied}ms after the server action click`);
await browser.close();

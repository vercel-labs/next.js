import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3000';
const OUT = process.env.OUT || '/workspace/.next-maintainer/reproduction-artifacts/playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${BASE}/?key1=1&key2=2`, { waitUntil: 'load' });
await page.waitForFunction(() => !document.body.innerText.includes('loading...'), null, { timeout: 120000 });

async function run(label, buttonText) {
  await page.waitForFunction(() => !document.body.innerText.includes('loading...'), null, { timeout: 120000 });
  const before = page.url();
  const t0 = Date.now();
  let urlChangedAt = null, fallbackAt = null;
  const poll = setInterval(async () => {}, 1000);
  await page.getByText(buttonText, { exact: true }).click();
  // poll DOM/url
  while (Date.now() - t0 < 60000) {
    const [url, txt] = await page.evaluate(() => [location.href, document.body.innerText]);
    if (urlChangedAt === null && url !== before) urlChangedAt = Date.now() - t0;
    if (fallbackAt === null && txt.includes('loading...')) fallbackAt = Date.now() - t0;
    if (urlChangedAt !== null && (fallbackAt !== null || Date.now()-t0 > 20000)) break;
    await new Promise(r => setTimeout(r, 30));
  }
  clearInterval(poll);
  await page.screenshot({ path: `${OUT}/${label}.png` });
  console.log(JSON.stringify({ label, buttonText, urlChangedAfterMs: urlChangedAt, fallbackVisibleAfterMs: fallbackAt }));
}

await run('both', 'Refresh via router (both)');
await run('key1-only', 'Refresh via router key 1');
await run('key2-only', 'Refresh via router key 2');
await run('both-2', 'Refresh via router (both)');
await run('key1-only-2', 'Refresh via router key 1');
await browser.close();

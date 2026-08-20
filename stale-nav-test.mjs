import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'dev';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base + '/', { waitUntil: 'networkidle' });

const seen = [];
const start = Date.now();
const poll = setInterval(async () => {
  try {
    const t = (await page.locator('body').innerText()).split('\n').pop().trim();
    if (/^Post|^Home/.test(t) && seen[seen.length - 1]?.text !== t) {
      seen.push({ t: Date.now() - start, text: t });
    }
  } catch {}
}, 30);

// warm up routes so RSC requests are the only delay source
await page.getByRole('link', { name: 'Post 1', exact: true }).click();
await page.waitForTimeout(120);
await page.getByRole('link', { name: 'Post 2', exact: true }).click();
await page.waitForTimeout(120);
await page.getByRole('link', { name: 'Post 3', exact: true }).click();

await page.waitForTimeout(9000);
clearInterval(poll);
await page.screenshot({
  path: `./${label}-final.png`,
});
console.log(label, 'url:', page.url());
console.log(JSON.stringify(seen, null, 1));
await browser.close();

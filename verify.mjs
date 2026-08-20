import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:4011';
const browser = await chromium.launch();
const page = await browser.newPage();
let logs = [];
page.on('console', (m) => {
  if (m.text().includes('RootLayout render')) logs.push(m.text());
});
await page.goto(base + '/a/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
console.log('after initial load:', logs.length, 'render log(s)');

for (const t of ['b', 'c', 'd', 'e', 'b', 'c']) {
  logs = [];
  await page.click(`a[href^="/${t}"]`);
  await page.waitForFunction(
    (p) => location.pathname.replace(/\/$/, '') === '/' + p,
    t,
    { timeout: 5000 }
  );
  await page.waitForTimeout(800);
  console.log(`Link nav -> /${t}/ : root layout re-renders = ${logs.length}`);
}
await browser.close();

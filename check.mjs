// Automated check for https://github.com/vercel/next.js/issues/75762
// Usage: npm run dev  (in another shell), then: node check.mjs [port]
import { chromium } from 'playwright';
const port = process.argv[2] || 3000;
const browser = await chromium.launch();
const page = await browser.newPage();
let renders = 0, rscRequests = 0;
page.on('console', (m) => { if (m.text().includes('Rendering PhotoModal')) renders++; });
page.on('request', (r) => { if (r.url().includes('/photos/1')) rscRequests++; });
await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
await page.click('text=Open console and terminal and click me');
for (let i = 1; i <= 6; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  console.log(`t+${i * 5}s  PhotoModal renders=${renders}  /photos/1 requests=${rscRequests}`);
}
await browser.close();
console.log(renders > 20 ? 'BUG: render/fetch loop never settles' : 'OK: settled');

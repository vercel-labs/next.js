// node verify.mjs   (requires: npm i -D playwright && npx playwright install chromium)
import { chromium } from 'playwright';
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
for (const href of ['/products#category-42', '/products-with-suspense#category-42']) {
  await p.goto(base + '/', { waitUntil: 'load' });
  await p.waitForTimeout(1000);
  await p.click(`a[href="${href}"]`);
  await p.waitForTimeout(2500);
  const res = await p.evaluate(() => ({
    scrollY: window.scrollY,
    targetTop: document.getElementById('category-42')?.getBoundingClientRect().top ?? null,
  }));
  console.log(href, JSON.stringify(res));
}
await b.close();

import { chromium } from 'playwright';
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const browser = await chromium.launch({ channel: 'chromium' });
const targets = [
  ['static-html', 'http://localhost:3002/#:~:text=unicornmagic'],
  ['next-pages-export', 'http://localhost:3001/#:~:text=unicornmagic'],
  ['next-app-router-prod', 'http://localhost:3003/#:~:text=unicornmagic'],
];
for (const [name, url] of targets) {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const h = await cdp.send('Page.getNavigationHistory');
  const current = h.entries[h.currentIndex].url;
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${name}: urlBar=${current} keptFragment=${current.includes(':~:text=')} scrollY=${await page.evaluate(()=>Math.round(scrollY))}`);
  await page.close();
}
await browser.close();

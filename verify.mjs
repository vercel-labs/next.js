// Usage: node verify.mjs [baseUrl]   (requires `npm i -D playwright && npx playwright install chromium`)
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3000';
const b = await chromium.launch();
const p = await b.newPage();
p.on('console', (m) => {
  if (/hydrat/i.test(m.text())) console.log('[console]', m.text().slice(0, 800));
});
await p.goto(base + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
console.log('SSR + hydrate  #theme class =', JSON.stringify(await p.locator('#theme').getAttribute('class')));
await p.goto(base + '/other', { waitUntil: 'networkidle' });
await p.click('#go');
await p.waitForSelector('#theme');
await p.waitForTimeout(1000);
console.log('client-nav     #theme class =', JSON.stringify(await p.locator('#theme').getAttribute('class')));
console.log('client-nav     #theme bg    =', await p.locator('#theme').evaluate((e) => getComputedStyle(e).backgroundColor));
await b.close();

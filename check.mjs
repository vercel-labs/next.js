import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const outDir = process.env.OUT || '.';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' });
await p.click('#counter'); await p.click('#counter');
console.log('before nav: counter =', await p.textContent('#counter'), '| params =', await p.textContent('#params'));
await p.screenshot({ path: outDir + '/1-before-nav.png' });
let sawLoading = false;
p.click('#open-modal');
for (let i = 0; i < 40; i++) {
  if (await p.$('#children-loading')) { sawLoading = true; await p.screenshot({ path: outDir + '/2-loading-shown.png' }); break; }
  await p.waitForTimeout(50);
}
await p.waitForSelector('#modal', { timeout: 15000 });
await p.waitForSelector('#counter', { timeout: 15000 });
await p.screenshot({ path: outDir + '/3-after-nav.png' });
console.log('after nav : counter =', await p.textContent('#counter'), '| params =', await p.textContent('#params'), '| modal =', await p.textContent('#modal'));
console.log('loading boundary shown during navigation:', sawLoading);
console.log('URL:', p.url());
await b.close();

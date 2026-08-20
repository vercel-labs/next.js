import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('pageerror: '+e.message));
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.click('#push');
await p.waitForURL('**/blog', { timeout: 15000 });
await p.waitForSelector('#params');
const out = {
  url: p.url(),
  params: await p.textContent('#params'),
  search: await p.textContent('#search'),
  consoleErrors: errs,
};
console.log(JSON.stringify(out, null, 2));
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/blog-after-push.png', fullPage: true });
await b.close();

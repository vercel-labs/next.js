import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const logs = [];
p.on('console', m => { if (m.text().includes('inline script')) { logs.push(m.text()); console.log('CONSOLE:', m.text()); } });
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
console.log('--- after first load ---');
for (let i = 1; i <= 3; i++) {
  await p.click('text=Go to other page');
  await p.waitForSelector('text=Back home');
  await p.waitForTimeout(1000);
  await p.click('text=Back home');
  await p.waitForSelector('h1:text("Home")');
  await p.waitForTimeout(2000);
  console.log(`--- after client nav round ${i} ---`);
}
await p.screenshot({ path: 'home-after-nav.png' });
console.log('WITH id count:', logs.filter(l=>l.includes('WITH id')).length);
console.log('WITHOUT id count:', logs.filter(l=>l.includes('WITHOUT id')).length);
await b.close();

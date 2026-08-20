import { chromium } from 'playwright';
const port = process.argv[2];
const out = process.argv[3];
const browser = await chromium.launch();
const page = await browser.newPage();
const msgs = [];
page.on('console', m => msgs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`));
// rapid reloads: cancel each navigation mid-stream
for (let i = 0; i < 6; i++) {
  page.goto(`http://localhost:${port}/`, { waitUntil: 'commit' }).catch(() => {});
  await new Promise(r => setTimeout(r, 500));
}
await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' }).catch(()=>{});
await page.screenshot({ path: out, fullPage: true });
console.log(msgs.join('\n') || 'no console messages');
await browser.close();

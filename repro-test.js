const { chromium } = require('playwright');
const fs = require('fs');
const ART = process.env.ART_DIR || '.';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const log = [];
  const p = (...a) => { const s = a.join(' '); console.log(s); log.push(s); };
  page.on('console', m => p(`[console:${m.type()}] ${m.text()}`));
  page.on('requestfailed', r => p(`[reqfailed] ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.url().includes('/static/chunks/')) p(`[resp] ${r.status()} ${r.url()}`); });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const status = () => page.textContent('p >> nth=1').catch(()=>null);
  const btn = page.getByRole('button');

  p('== phase 1: offline ==');
  await ctx.setOffline(true);
  await btn.click();
  await page.waitForFunction(() => document.body.innerText.includes('error') , null, {timeout:15000}).catch(()=>p('no error appeared'));
  p('status after offline click: ' + await status());

  p('== phase 2: back online, repeated clicks ==');
  await ctx.setOffline(false);
  p('navigator.onLine=' + await page.evaluate(()=>navigator.onLine));
  const t0 = Date.now();
  for (let i = 0; i < 12; i++) {
    await btn.click();
    await page.waitForTimeout(800);
    p(`t=+${((Date.now()-t0)/1000).toFixed(1)}s click#${i+1} -> ${await status()}`);
  }
  await page.screenshot({ path: ART + '/after-online-clicks.png', fullPage: true });

  p('== phase 3: reload control ==');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button').click();
  await page.waitForTimeout(1500);
  p('status after reload+click: ' + await status());
  await page.screenshot({ path: ART + '/after-reload.png', fullPage: true });

  fs.writeFileSync(ART + '/run-log.txt', log.join('\n'));
  await browser.close();
})();

const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('response', r => { const u=new URL(r.url()); if(!u.pathname.startsWith('/_next/static')) logs.push(`[net] ${u.pathname}${u.search} rsc=${r.request().headers()['rsc']||'-'} -> ${r.status()} ${r.headers()['content-type']||''} ${r.headers()['location']||''}`)});
  const txt = async s => { try { return await page.textContent(s) } catch { return 'n/a' } };
  const snap = async t => logs.push(`${t} url=${page.url()} ${await txt('#mode')} stamp=${await txt('#stamp')}`);
  await page.goto('http://localhost:3000/start', { waitUntil: 'networkidle' });
  await snap('BEFORE');
  await page.evaluate(() => { document.cookie = 'mode=B; path=/' });
  await page.click('#go-direct');
  await page.waitForTimeout(3000);
  await snap('AFTER-CONTROL-PUSH-SELF');
  console.log(logs.join('\n'));
  await browser.close();
})();

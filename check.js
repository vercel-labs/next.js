const { chromium } = require('playwright');
(async () => {
  const label = process.argv[2] || 'case';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('console', m => logs.push('[console:'+m.type()+'] '+m.text()));
  page.on('pageerror', e => logs.push('[pageerror] '+e.message));
  page.on('response', r => {
    const u = new URL(r.url());
    if (u.pathname.startsWith('/_next/static')) return;
    const rh = r.request().headers();
    logs.push(`[net] ${r.request().method()} ${u.pathname}${u.search} rsc-hdr=${rh['rsc']||'-'} -> ${r.status()} ct=${r.headers()['content-type']||'-'} ${r.headers()['location']||''}`);
  });
  const txt = async (s) => { try { return await page.textContent(s) } catch { return 'n/a' } };
  const snap = async (tag) => logs.push(`${tag} url=${page.url()} h1=${await txt('#page')} ${await txt('#mode')} stamp=${await txt('#stamp')}`);
  await page.goto('http://localhost:3000/start', { waitUntil: 'networkidle' });
  await snap('BEFORE');
  await page.evaluate(() => { document.cookie = 'mode=B; path=/' });
  logs.push('set cookie mode=B (server state changed)');
  await page.click('#go');
  await page.waitForTimeout(4000);
  await snap('AFTER-PUSH');
  await page.reload({ waitUntil: 'networkidle' });
  await snap('AFTER-HARD-RELOAD');
  await page.screenshot({ path: `./${label}.png`, fullPage: true });
  console.log(logs.join('\n'));
  await browser.close();
})();

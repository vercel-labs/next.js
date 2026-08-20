const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const msgs = [];
  p.on('console', m => msgs.push(`[${m.type()}] ${m.text()}`));
  p.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`));
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const info = async () => p.evaluate(() => ({
    headHTML: document.head.innerHTML.slice(0, 1200),
    bodyTitles: document.querySelectorAll('body title').length,
    headTitles: document.querySelectorAll('head title').length,
    title: document.title,
    htmlLang: document.documentElement.lang,
  }));
  console.log('INITIAL', JSON.stringify(await info(), null, 1));
  await p.click('#to-other');
  await p.waitForTimeout(1500);
  console.log('AFTER NAV', JSON.stringify(await info(), null, 1));
  await p.goBack(); await p.waitForTimeout(1500);
  console.log('AFTER BACK', JSON.stringify(await info(), null, 1));
  await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/index.png', fullPage: true });
  console.log('CONSOLE:\n' + msgs.join('\n'));
  await b.close();
})();

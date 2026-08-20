const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2];
  const tag = process.argv[3];
  const b = await chromium.launch();
  const p = await b.newPage();
  const msgs = [];
  p.on('console', m => msgs.push(`[console:${m.type()}] ${m.text()}`));
  p.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => {
    const h1 = document.querySelector('h1');
    return {
      color: h1 ? getComputedStyle(h1).color : null,
      fontSize: h1 ? getComputedStyle(h1).fontSize : null,
      styleTags: [...document.querySelectorAll('style')].map(s => ({ nonce: s.getAttribute('nonce'), text: s.textContent.slice(0,120) })),
      linkTags: [...document.querySelectorAll('link[rel=stylesheet]')].map(l => ({ href: l.getAttribute('href'), nonce: l.getAttribute('nonce') })),
    };
  });
  console.log(JSON.stringify({ url, info, msgs }, null, 2));
  await p.screenshot({ path: `./${tag}.png`, fullPage: true });
  await b.close();
})();

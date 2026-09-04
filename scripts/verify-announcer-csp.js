const { chromium } = require('playwright');
const CHROME = process.env.CHROME_PATH; // optional; defaults to Playwright's bundled Chromium
(async () => {
  const b = await chromium.launch(CHROME ? { executablePath: CHROME, args: ['--no-sandbox'] } : { args: ['--no-sandbox'] });
  const p = await b.newPage();
  p.on('console', m => { if (m.type()==='error') console.log('CONSOLE ERROR:', m.text()); });
  await p.addInitScript(() => {
    window.__v = [];
    document.addEventListener('securitypolicyviolation', e => {
      window.__v.push({ directive: e.effectiveDirective, sample: e.sample, source: e.sourceFile, line: e.lineNumber });
    });
  });
  const resp = await p.goto(process.env.BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  console.log('CSP:', resp.headers()['content-security-policy']);
  await p.waitForTimeout(1500);
  const st = async () => p.evaluate(() => {
    const c = document.getElementsByTagName('next-route-announcer')[0];
    if (!c) return { present: false, violations: window.__v };
    const a = c.shadowRoot && c.shadowRoot.childNodes[0];
    return { present: true,
      containerStyleAttr: c.getAttribute('style'),
      containerComputedPosition: getComputedStyle(c).position,
      announcerStyleAttr: a && a.getAttribute('style'),
      announcerComputedHeight: a && getComputedStyle(a).height,
      announcerComputedOverflow: a && getComputedStyle(a).overflow,
      announcerText: a && a.textContent,
      violations: window.__v };
  });
  console.log('AFTER LOAD', JSON.stringify(await st(), null, 2));
  await p.screenshot({ path: 'page1.png' });
  await p.click('text=Go to page 2');
  await p.waitForTimeout(1500);
  console.log('AFTER NAV', JSON.stringify(await st(), null, 2));
  await p.screenshot({ path: 'page2.png' });
  await b.close();
})();

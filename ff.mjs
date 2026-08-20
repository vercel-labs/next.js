import { firefox } from 'playwright';
const targets = process.argv.slice(2);
const b = await firefox.launch({ firefoxUserPrefs: { 'dom.enable_performance_observer': false } });
for (const url of targets) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('[pageerror] ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('[console.error] ' + m.text()) });
  console.log('=== ' + url);
  console.log('typeof PerformanceObserver before nav:', await p.evaluate(() => typeof PerformanceObserver).catch(()=>'n/a'));
  await p.goto(url, { waitUntil: 'load', timeout: 60000 });
  console.log('typeof PerformanceObserver:', await p.evaluate(() => typeof window.PerformanceObserver));
  await p.waitForTimeout(6000);
  const name = url.replace(/[^a-z0-9]+/gi,'_');
  await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/ff_${name}.png` });
  console.log('body:', (await p.locator('body').innerText()).slice(0,300).replace(/\n+/g,' | '));
  console.log('errors:', errs.length ? errs.join('\n  ') : 'none');
  await ctx.close();
}
await b.close();

const { webkit, chromium, devices } = require('playwright');
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';

async function run(name, browserType) {
  const browser = await browserType.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14'] , hasTouch:true, isMobile:true});
  const page = await ctx.newPage();
  await page.goto(process.env.BASE + '/', { waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => Math.round(window.scrollY));
  const link = await page.evaluate(() => {
    const els = [...document.querySelectorAll('a')];
    const el = els.find(a => a.getBoundingClientRect().top > 100 && a.getBoundingClientRect().top < 500);
    el.click();
    return el.getAttribute('href');
  });
  await page.waitForFunction(() => location.pathname.startsWith('/detail'));
  await page.waitForTimeout(300);
  // quick upward "fling" on detail page then immediate back
  await page.evaluate(() => { window.scrollTo(0, 300); window.scrollTo(0, 0); });
  const back = page.goBack({ waitUntil: 'commit' }).catch(e => e);
  await back;
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => Math.round(window.scrollY));
  const mode = await page.evaluate(() => history.scrollRestoration);
  console.log(`${name}: href=${link} before=${before} after=${after} scrollRestoration=${mode} => ${after >= before - 50 ? 'RESTORED' : 'NOT RESTORED'}`);
  await page.screenshot({ path: `${OUT}/${name}-after-back.png` });
  await browser.close();
}

(async () => {
  await run(process.env.TAG+'-webkit', webkit);
  await run(process.env.TAG+'-chromium', chromium);
})();

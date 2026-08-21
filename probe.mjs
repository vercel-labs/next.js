import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chromium' });
for (const [name,url] of [['pages','http://localhost:3001/#:~:text=unicornmagic'],['app','http://localhost:3003/#:~:text=unicornmagic']]) {
  const page = await browser.newPage();
  page.on('console', m => console.log(name, m.text()));
  await page.addInitScript(() => {
    for (const k of ['replaceState','pushState']) {
      const orig = history[k].bind(history);
      history[k] = (...a) => { console.log(`history.${k}(args=${a.length}, url=${JSON.stringify(a[2])})`); return orig(...a); };
    }
  });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.close();
}
await browser.close();

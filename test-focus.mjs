import { chromium } from 'playwright';

const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const browser = await chromium.launch();
const results = {};

for (const which of ['plain-anchor', 'next-link']) {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1500);
  await page.click(`#${which}`);
  await page.waitForTimeout(1000);
  const url = page.url();
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? (el.id || el.tagName) : 'none';
  });
  const target = await page.evaluate(() => !!document.querySelector('#target:target'));
  results[which] = { urlAfterClick: url, focusedAfterTab: focused, targetPseudoMatches: target };
  await page.screenshot({ path: `${OUT}/${which}-after-tab.png` });
  await page.close();
}
console.log(JSON.stringify(results, null, 2));
await browser.close();

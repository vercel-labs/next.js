// Reproduces vercel/next.js#78092:
// "TypeError: Cannot read properties of null (reading 'type')" shown as a
// full-screen "Runtime Error" by the Next.js dev overlay, even though the app
// itself contains no such code.
//
// The error is raised by a script that runs OUTSIDE the app bundle. A browser
// extension content script is the real-world source (Trust Wallet / other web3
// wallets probe every page and read `.type` off a null value). We simulate that
// with Playwright's addInitScript, which injects into the page in the same way
// a content script does.
//
// Usage: pnpm dev (or npm run dev), then: node scripts/repro.js http://localhost:3100
const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2] || 'http://localhost:3100';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.addInitScript(() => {
    // Stand-in for an extension content script probing the page after load.
    setTimeout(() => {
      Promise.resolve().then(() => {
        const provider = null;
        return provider.type;
      });
    }, 2500);
  });

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(6000);

  // Open the dev indicator / issues panel.
  await page
    .locator('[data-issues-open]')
    .click({ timeout: 5000 })
    .catch(() => page.locator('[data-next-badge]').click({ timeout: 5000 }).catch(() => {}));
  await page.waitForTimeout(2000);

  const text = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('nextjs-portal')) {
      if (!el.shadowRoot) continue;
      for (const child of el.shadowRoot.children) {
        if (child.tagName === 'STYLE') continue;
        out.push(child.innerText || '');
      }
    }
    return out.join('\n');
  });

  console.log('--- dev overlay contents ---');
  console.log(text.replace(/\n{2,}/g, '\n'));

  await page.screenshot({ path: 'overlay.png', fullPage: true });
  await browser.close();

  if (!/Cannot read properties of null \(reading 'type'\)/.test(text)) {
    console.error('NOT REPRODUCED: overlay did not show the error');
    process.exit(1);
  }
  console.log('REPRODUCED: dev overlay attributes an extension-originated error to the app.');
})();

// Measures the gap between the browser's native img "load" event and
// next/image's onLoad callback, while the client JS bundle is slow (3s).
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const JS_DELAY = Number(process.env.JS_DELAY || 3000);
const OUT = process.env.OUT_DIR || '/workspace/.next-maintainer/reproduction-artifacts/playwright';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const page = await browser.newPage();

await page.addInitScript(() => {
  window.__nativeLoadAt = null;
  window.__onLoadAt = null;
  window.__start = performance.now();
  document.addEventListener(
    'load',
    (e) => {
      if (e.target && e.target.tagName === 'IMG' && window.__nativeLoadAt === null) {
        window.__nativeLoadAt = performance.now();
      }
    },
    true
  );
});

// Simulate a slow JS bundle (slow network / big app) while the image itself is fast.
await page.route('**/_next/static/**', async (route) => {
  if (route.request().url().endsWith('.js')) await sleep(JS_DELAY);
  await route.continue();
});

await page.goto(BASE, { waitUntil: 'commit' });

// Wait for the native image load.
await page.waitForFunction(() => window.__nativeLoadAt !== null, null, { timeout: 30000 });
const afterNative = await page.evaluate(() => {
  const img = document.querySelector('img');
  return {
    nativeLoadAt: Math.round(window.__nativeLoadAt - window.__start),
    onLoadAt: window.__onLoadAt,
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    opacity: getComputedStyle(img).opacity,
    wrapperBg: getComputedStyle(document.getElementById('wrapper')).backgroundColor,
  };
});
await page.screenshot({ path: `${OUT}/1-image-loaded-but-still-placeholder.png` });

await page.waitForFunction(() => window.__onLoadAt !== null, null, { timeout: 30000 });
const afterOnLoad = await page.evaluate(() => {
  const img = document.querySelector('img');
  return {
    nativeLoadAt: Math.round(window.__nativeLoadAt - window.__start),
    onLoadAt: Math.round(window.__onLoadAt - window.__start),
    opacity: getComputedStyle(img).opacity,
  };
});
await page.screenshot({ path: `${OUT}/2-after-onload.png` });

const result = {
  jsBundleDelayMs: JS_DELAY,
  nativeImgLoadAtMs: afterOnLoad.nativeLoadAt,
  nextImageOnLoadAtMs: afterOnLoad.onLoadAt,
  onLoadLagMs: afterOnLoad.onLoadAt - afterOnLoad.nativeLoadAt,
  stateWhenImageFinishedDownloading: afterNative,
  opacityAfterOnLoad: afterOnLoad.opacity,
};
console.log(JSON.stringify(result, null, 2));
fs.writeFileSync(`${OUT}/measurements.json`, JSON.stringify(result, null, 2));
await browser.close();

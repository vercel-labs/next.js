// Measures paint stalls caused by the next/image placeholder="blur" SVG,
// in Firefox and Chromium, on the built app (`next start`) at http://localhost:3000.
// Usage: node measure.mjs [baseUrl]
import { firefox, chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3000';

async function appPage(bt, name) {
  const b = await bt.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  // Hang the optimized image request so the blur placeholder stays painted.
  await p.route(/_next\/image|\.jpg/, () => {});
  await p.goto(base + '/', { waitUntil: 'load' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(500);
  const r = await p.evaluate(async () => {
    const el = document.querySelector('img');
    const frames = [];
    let last = performance.now();
    const t0 = last;
    await new Promise((res) => {
      let i = 0;
      const tick = (t) => {
        frames.push(t - last);
        last = t;
        // invalidate the placeholder's painted area, like a scroll/resize does
        el.style.transform = `scale(${1 + (i++ % 2) * 0.01})`;
        t - t0 < 4000 ? requestAnimationFrame(tick) : res();
      };
      requestAnimationFrame((t) => { last = t; requestAnimationFrame(tick); });
    });
    return {
      usesBlurPlaceholder: getComputedStyle(el).backgroundImage.includes('feGaussianBlur'),
      renderedSize: Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height),
      maxFrameMs: Math.round(Math.max(...frames)),
      framesOver100ms: frames.filter((f) => f > 100).map((f) => Math.round(f)),
    };
  });
  console.log('app  ', name, JSON.stringify(r));
  await b.close();
}

async function harness(bt, name) {
  const b = await bt.launch();
  for (const v of ['next', 'cssblur', 'none']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await p.goto(`${base}/blur-stall.html?v=${v}&w=1200&h=600&r=${Math.random()}`);
    console.log('bench', name, JSON.stringify(await p.evaluate(() => window.done)));
    await p.close();
  }
  await b.close();
}

for (const [bt, name] of [[firefox, 'firefox'], [chromium, 'chromium']]) {
  await appPage(bt, name);
  await harness(bt, name);
}

import { chromium } from 'playwright';
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const port = process.env.PORT || 3000;
const tag = process.env.TAG || 'x';
const b = await chromium.launch();
const p = await b.newPage();
p.on('console', (m) => { if (m.text().startsWith('[client]')) console.log(m.text()); });
await p.goto(`http://localhost:${port}/parent/resources`, { waitUntil: 'networkidle' });
await p.waitForSelector('[data-testid="resources-list"]');
await p.waitForTimeout(1000);
await p.evaluate(() => {
  window.__samples = [];
  const sample = () => {
    const s = {
      loading: document.querySelectorAll('[data-testid="parent-loading"]').length, rloading: document.querySelectorAll('[data-testid="resources-loading"]').length,
      list: document.querySelectorAll('[data-testid="resources-list"]').length,
      layouts: document.querySelectorAll('[data-testid="parent-layout"]').length,
      modal: document.querySelectorAll('[data-testid="modal"]').length,
    };
    const last = window.__samples[window.__samples.length - 1];
    const k = JSON.stringify(s);
    if (!last || last.k !== k) window.__samples.push({ k, t: performance.now() });
    requestAnimationFrame(sample);
  };
  sample();
});
await p.click('[data-testid="link-1"]');
await p.waitForTimeout(150);
await p.screenshot({ path: `${OUT}/${tag}-during-navigation.png`, fullPage: true });
await p.waitForSelector('[data-testid="modal"]', { timeout: 15000 }).catch(() => console.log('NO MODAL'));
await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/${tag}-after-modal.png`, fullPage: true });
const samples = await p.evaluate(() => window.__samples);
console.log(`== ${tag} DOM state timeline (loading/list/layouts/modal) ==`);
for (const s of samples) console.log(Math.round(s.t), s.k);
await b.close();

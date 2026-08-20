// Usage: node scripts-check.mjs <label>
import { chromium } from 'playwright';
const label = process.argv[2] || 'run';
const OUT = './screenshots';
const b = await chromium.launch();
const p = await b.newPage();
let errs = [];
p.on('pageerror', e => errs.push(e.message));
const report = async (step) => {
  const txt = (await p.textContent('body')).replace(/\s+/g, ' ');
  const overlay = txt.match(/(Unhandled Runtime Error|TypeError[^<]{0,120}|Server Error|Cannot read properties[^ ]* [^ ]* [^ ]*)/);
  console.log(`[${step}] url=${p.url()} pageerrors=${JSON.stringify([...new Set(errs)])} heading=${(txt.match(/Story: \d+/)||['<none>'])[0]}`);
  await p.screenshot({ path: `${OUT}/${label}-${step}.png`, fullPage: true });
  errs = [];
};
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await report('1-home');
await p.click('text=Go to test (next link)');
await p.waitForTimeout(6000);
await report('2-after-Link-click');
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
await report('3-after-reload');
await b.close();

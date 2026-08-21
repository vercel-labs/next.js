import { chromium } from 'playwright';
const OUT = './screenshots';
const mode = process.argv[2] || 'hard';
const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('console', m => { if (m.type()==='error') errs.push('console:'+m.text()); });
p.on('pageerror', e => errs.push('pageerror:'+e.message));
async function state(label) {
  const hydrated = await p.evaluate(() => document.documentElement.dataset.hydrated || 'no');
  let clickWorked = false;
  try {
    await p.click('#counter', { timeout: 3000 });
    clickWorked = (await p.textContent('#counter')).includes('count: 1');
  } catch(e) {}
  console.log(`[${label}] url=${p.url()} title=${await p.textContent('#title')} hydrated=${hydrated} clickIncrements=${clickWorked}`);
  await p.screenshot({ path: `${OUT}/${mode}-${label}.png` });
}
await p.goto('http://localhost:3000/', { waitUntil: 'load' });
await p.waitForTimeout(2000);
await state('initial-home');
await p.click(mode === 'hard' ? '#hard' : '#soft');
await p.waitForTimeout(2500);
await state('on-other');
await p.goBack({ waitUntil: 'load' });
await p.waitForTimeout(3000);
await state('after-back-home');
console.log('errors:', JSON.stringify(errs, null, 1));
await b.close();

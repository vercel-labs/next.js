import { chromium } from 'playwright';
import fs from 'node:fs';

const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const HANDLERS = new URL('./src/mocks/handlers.js', import.meta.url).pathname;
const url = process.env.URL || 'http://localhost:3000';

const logs = [];
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => { logs.push(m.text()); });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('#fetch-movies');

async function click(label) {
  logs.length = 0;
  await page.click('#fetch-movies');
  await page.waitForTimeout(500);
  const handled = logs.filter((l) => l.includes('handled'));
  console.log(`--- ${label}: ${handled.length} "[mock] handled" log(s)`);
  handled.forEach((l) => console.log('    ' + l));
  return handled.length;
}

const results = [];
results.push(['initial', await click('initial load')]);

const original = fs.readFileSync(HANDLERS, 'utf8');
for (let i = 1; i <= 3; i++) {
  fs.writeFileSync(HANDLERS, original.replace('The Matrix', `The Matrix ${i}`));
  await page.waitForTimeout(4000); // let HMR apply
  results.push([`after HMR edit #${i}`, await click(`after HMR edit #${i}`)]);
}
fs.writeFileSync(HANDLERS, original);
await page.screenshot({ path: `${ART}/after-hmr.png` });
console.log('\nSUMMARY');
for (const [k, v] of results) console.log(`  ${k}: ${v} handler invocation(s) per single click`);
await browser.close();

import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3000';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' });
console.log('initial   len =', await p.textContent('#len'));
for (let i = 1; i <= 3; i++) {
  await p.click('#add');
  await p.waitForTimeout(2500);
  console.log(`after add #${i} len =`, await p.textContent('#len'));
}
await p.reload({ waitUntil: 'networkidle' });
console.log('after reload len =', await p.textContent('#len'), '(expected 5, buggy 2)');
await b.close();

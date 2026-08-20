import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3000';
const b = await chromium.launch();
const p = await b.newPage();
const logs = [];
p.on('console', m => logs.push(m.text()));
await p.goto(base + '/?foo=100', { waitUntil: 'networkidle' });
const t = [];
for (let i=0;i<6;i++){ await p.waitForTimeout(500); t.push(`t=${(i+1)*500}ms url=${new URL(p.url()).search}`); }
console.log('--- console logs ---');
logs.forEach(l=>console.log(l));
console.log('--- url timeline ---');
t.forEach(l=>console.log(l));
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/after-load.png' });
// second phase: click button repeatedly
logs.length = 0;
for (let i=0;i<8;i++){ await p.click('button'); await p.waitForTimeout(400); console.log(`click ${i+1}: url=${new URL(p.url()).search} logs=${JSON.stringify(logs)}`); logs.length=0; }
await b.close();

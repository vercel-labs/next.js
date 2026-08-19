// node verify.mjs   (requires: npm i -D playwright, server already on :3000)
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000/gated', { waitUntil: 'load' });
await p.waitForTimeout(1500);
console.log('typed URL   ->', p.url(), p.url().endsWith('/destination') ? 'OK' : 'FAIL');
await p.goto('http://localhost:3000/start', { waitUntil: 'load' });
await p.waitForTimeout(500);
await p.click('#to-gated');
await p.waitForTimeout(3000);
console.log('clicked Link->', p.url(), p.url().endsWith('/destination') ? 'OK' : 'FAIL (bug)');
await b.close();

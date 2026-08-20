import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const b = await chromium.launch();
const ctx = await b.newContext();
// simulate a browser that supports ES modules but lacks Promise.allSettled (e.g. Chrome 61-75)
await ctx.addInitScript(() => { delete Promise.allSettled; });
const page = await ctx.newPage();
const reqs = [];
page.on('request', r => reqs.push(r.url()));
await page.goto(base, { waitUntil: 'networkidle' });
const html = await (await fetch(base)).text();
const tag = html.match(/<script[^>]*polyfills[^>]*>/i);
console.log('polyfill script tag in HTML:', tag ? tag[0] : 'NONE');
console.log('polyfill chunk requested by modern browser:', reqs.some(u => /polyfills-/.test(u)));
console.log('window.Promise.allSettled after hydration:', await page.evaluate(() => typeof Promise.allSettled));
console.log('rendered text:', (await page.textContent('p')));
await page.screenshot({ path: './allSettled.png' });
await b.close();

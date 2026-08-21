import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const nav = p.goto('http://localhost:3000/', { waitUntil: 'load' });
await p.waitForTimeout(600);
console.log('pending: head titles =', await p.evaluate(() => document.querySelectorAll('title').length), '| document.title =', JSON.stringify(await p.title()));
await nav; await p.waitForTimeout(300);
console.log('resolved: head titles =', await p.evaluate(() => document.querySelectorAll('title').length), '| document.title =', JSON.stringify(await p.title()));
await b.close();

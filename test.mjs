import { chromium } from 'playwright';
const A = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const p = await b.newPage();
const log = [];
await p.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await p.click('#link-1');
await p.waitForSelector('#modal');
log.push('after link click: url=' + p.url() + ' modalVisible=' + await p.isVisible('#modal'));
await p.screenshot({ path: A + '/1-modal-open.png' });
await p.click('#close-replace');
await p.waitForTimeout(3100);
log.push('after router.replace("/"): url=' + p.url() + ' modalVisible=' + await p.isVisible('#modal'));
await p.screenshot({ path: A + '/2-after-replace.png' });
// control: back()
await p.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await p.click('#link-2');
await p.waitForSelector('#modal');
await p.click('#close-back');
await p.waitForTimeout(3100);
log.push('control router.back(): url=' + p.url() + ' modalVisible=' + await p.isVisible('#modal'));
await p.screenshot({ path: A + '/3-after-back.png' });
// control: push
await p.goto('http://localhost:3100', { waitUntil: 'networkidle' });
await p.click('#link-3');
await p.waitForSelector('#modal');
await p.evaluate(() => {});
console.log(log.join('\n'));
await b.close();

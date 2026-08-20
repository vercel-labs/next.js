import { chromium } from 'playwright';
const base = process.argv[2], label = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage();
const read = async (name) => {
  const r = await p.evaluate(() => ({
    icon: getComputedStyle(document.getElementById('icon')).width,
    box: getComputedStyle(document.getElementById('box')).color,
    sheets: [...document.querySelectorAll('link[rel=stylesheet]')].map(n => n.href.split('/').pop()),
  }));
  console.log(label, name, JSON.stringify(r));
  await p.screenshot({ path: `./screenshots/${label}-${name}.png` });
};
await p.goto(base + '/other', { waitUntil: 'networkidle' });
await read('direct-other');
await p.goto(base + '/', { waitUntil: 'networkidle' });
await read('direct-home');
await p.click('#to-other');
await p.waitForSelector('#client-icon');
await new Promise(r => setTimeout(r, 800));
await read('nav-other');
await b.close();

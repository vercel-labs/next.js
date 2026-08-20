import { webkit, devices } from 'playwright';
const base = process.argv[2], label = process.argv[3];
const b = await webkit.launch();
const ctx = await b.newContext({ ...devices['iPhone 14 Pro Max'] });
const p = await ctx.newPage();
const s = async () => Math.round(await p.evaluate(() => window.scrollY));
await p.goto(base + '/no-hook', { waitUntil: 'load' });
await p.evaluate(() => window.scrollTo(0, 800)); await p.waitForTimeout(400);
await p.goto(base + '/', { waitUntil: 'load' });
const arrive = []; for (let i=0;i<6;i++){ arrive.push(await s()); await p.waitForTimeout(300); }
await p.goBack({ waitUntil: 'load' }); await p.waitForTimeout(800);
const back = await s();
await p.goForward({ waitUntil: 'load' });
const fwd = []; for (let i=0;i<6;i++){ fwd.push(await s()); await p.waitForTimeout(300); }
console.log(JSON.stringify({label, arrive, back, fwd}));
await b.close();

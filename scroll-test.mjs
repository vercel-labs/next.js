import { chromium } from 'playwright';
const PORT = process.env.PORT || 3001;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
async function trial(link) {
  await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const before = await p.evaluate(() => window.scrollY);
  await p.click(`a:text-is("${link}")`);
  await p.waitForFunction((l)=>document.querySelector('h1')?.textContent===l, link);
  await p.waitForTimeout(1200);
  console.log(`${link}: before=${before} after=${await p.evaluate(()=>window.scrollY)} titleInHead=${await p.evaluate(()=>!!document.head.querySelector('title'))}`);
}
await trial('Bar'); await trial('Foo');
await b.close();

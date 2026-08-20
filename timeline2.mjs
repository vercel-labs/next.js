import { chromium } from 'playwright';
const PORT = process.argv[2], PATHNAME = process.argv[3] || '/test2';
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`http://localhost:${PORT}${PATHNAME}`);
const t0=Date.now(); let last='';
while (Date.now()-t0 < 9000) {
  const txt = (await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').trim();
  if (txt !== last) { console.log(`+${String(Date.now()-t0).padStart(5)}ms | ${p.url()} | ${txt}`); last=txt; }
  await new Promise(r=>setTimeout(r,50));
}
await b.close();

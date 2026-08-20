const { chromium } = require('playwright');
const outDir = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
(async () => {
  const url = process.argv[2], tag = process.argv[3];
  const b = await chromium.launch(); const p = await b.newPage();
  const reqs = [];
  p.on('response', r => reqs.push(`${r.status()} ${r.url()}`));
  p.on('requestfailed', r => reqs.push(`FAILED ${r.url()}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  const loaded = await p.evaluate(async () => {
    await document.fonts.ready;
    return { status: [...document.fonts].map(f => f.family + ':' + f.status),
             check: document.fonts.check('64px MyPacifico') };
  });
  console.log('==', tag, url);
  console.log(reqs.filter(r => /woff2|\.css|404|FAILED/.test(r)).join('\n'));
  console.log('fontfaces:', JSON.stringify(loaded));
  await p.screenshot({ path: `${outDir}/${tag}.png` });
  await b.close();
})();

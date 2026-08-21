import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';

function log(...a) { console.log(...a); }

async function run(withQueryStep) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const reqs = [];
  page.on('request', (r) => {
    const h = r.headers();
    if (h['rsc'] || h['next-router-prefetch'] || r.url().includes('_rsc')) {
      reqs.push({
        url: r.url().replace(BASE, ''),
        rsc: h['rsc'],
        prefetch: h['next-router-prefetch'] || '-',
      });
    }
  });

  const mark = (label) => { log(`\n--- ${label}`); reqs.length = 0; };
  const dump = () => {
    if (!reqs.length) log('   (no RSC requests)');
    for (const r of reqs) log(`   RSC ${r.url}  prefetch=${r.prefetch}`);
    reqs.length = 0;
  };

  mark('1. goto / (page A, has prefetched <Link href="/b">)');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  dump();

  mark('2. click <Link> to /b');
  await page.click('a[href="/b"]');
  await page.waitForURL('**/b');
  await page.waitForTimeout(1000);
  log('   body:', (await page.textContent('p')).trim() + ' | ' + (await page.textContent('#rendered-at')).trim());
  dump();

  if (withQueryStep) {
    mark('3. click button -> router.replace("/b?test=first")');
    await page.click('text=First');
    await page.waitForURL('**/b?test=first');
    await page.waitForTimeout(1000);
    log('   body:', (await page.textContent('p')).trim() + ' | ' + (await page.textContent('#rendered-at')).trim());
    dump();
  }

  mark(`${withQueryStep ? '4' : '3'}. go back (to /)`);
  await page.goBack();
  await page.waitForTimeout(1500);
  log('   url:', page.url());
  dump();

  mark(`${withQueryStep ? '5' : '4'}. click <Link> to /b again`);
  await page.click('a[href="/b"]');
  await page.waitForURL('**/b');
  await page.waitForTimeout(2000);
  log('   url:', page.url(), '| body:', (await page.textContent('p')).trim() + ' | ' + (await page.textContent('#rendered-at')).trim());
  dump();

  await page.screenshot({ path: `${OUT}/${withQueryStep ? 'with' : 'without'}-query-step.png` });
  await browser.close();
}

log('=========== CONTROL: no query param step ===========');
await run(false);
log('\n=========== ISSUE SCENARIO: with query param step ===========');
await run(true);

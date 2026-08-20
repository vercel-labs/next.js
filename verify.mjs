// Loads /foo from the static-export server, triggers an unprefetched
// client-side navigation to the root path, and reports every request that 404s.
import { chromium } from 'playwright';

const basePath = '/next-static-export-404-reproduce';
const origin = 'http://localhost:3001';

const browser = await chromium.launch();
const page = await browser.newPage();
const responses = [];
page.on('response', (r) => {
  const url = r.url();
  if (!url.includes('/_next/static/')) responses.push({ status: r.status(), url });
});

await page.goto(`${origin}${basePath}/foo`, { waitUntil: 'networkidle' });
responses.length = 0;

await page.click('#push-root');
await page.waitForTimeout(3000);

console.log('Requests made by router.push("/"):');
for (const r of responses) console.log(' ', r.status, r.url);

const failed = responses.filter((r) => r.status === 404);
console.log('\n404 requests:', failed.length);
for (const r of failed) console.log('  ->', r.url);
console.log(
  '\nExpected file that does exist:',
  (await (await fetch(`${origin}${basePath}/index.txt?_rsc=1`)).status) + ' ' + `${basePath}/index.txt`
);
console.log(
  'Requested file that does not exist:',
  (await (await fetch(`${origin}${basePath}.txt?_rsc=1`)).status) + ' ' + `${basePath}.txt`
);
await page.screenshot({ path: 'verify.png' });
await browser.close();
process.exit(failed.length > 0 ? 1 : 0);

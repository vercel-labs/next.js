import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const MODE = process.env.MODE || 'link'; // link | push
const EXEC = process.env.CHROME_PATH || '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
const SHOTS = process.env.SHOT_DIR || '.';

const browser = await chromium.launch({ executablePath: EXEC });
const page = await browser.newPage();
const titles = [];
const record = async (label) => {
  await page.waitForTimeout(1200);
  const t = await page.title();
  titles.push(t);
  console.log(`${label} | url=${new URL(page.url()).pathname} | title="${t}"`);
};
const go = async (coin) => {
  await page.click(MODE === 'push' ? `#push-${coin}` : `#link-${coin}`);
  await page.waitForSelector('#coin');
};

await page.goto(BASE, { waitUntil: 'networkidle' });
await record('1. home');
await go('bitcoin');
await record('2. coin bitcoin');
await page.screenshot({ path: `${SHOTS}/${MODE}-2-bitcoin.png` });
await page.click('#home');
await page.waitForSelector('#link-ethereum');
await record('3. back home (link)');
await go('ethereum');
await record('4. coin ethereum');
await page.screenshot({ path: `${SHOTS}/${MODE}-4-ethereum.png` });
await page.goBack();
await page.waitForSelector('#link-solana');
await record('5. browser back');
await go('solana');
await record('6. coin solana');
await page.screenshot({ path: `${SHOTS}/${MODE}-6-solana.png` });
await browser.close();

const expected = ['Secret Terminal', 'Bitcoin', 'Secret Terminal', 'Ethereum', 'Secret Terminal', 'Solana'];
console.log('\nmode:', MODE);
console.log('expected:', JSON.stringify(expected));
console.log('actual  :', JSON.stringify(titles));
console.log(JSON.stringify(expected) === JSON.stringify(titles) ? 'RESULT: PASS' : 'RESULT: FAIL (stale/incorrect title)');

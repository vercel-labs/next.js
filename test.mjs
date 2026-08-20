import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const base = process.env.BASE || 'http://localhost:3000';
const SHOT = process.env.SHOT_DIR || './screenshots';
const tag = process.env.TAG || 'run';
mkdirSync(SHOT, { recursive: true });
const b = await chromium.launch();
const page = await b.newPage();
const st = async (label) => {
  const html = await page.evaluate(() => ({
    children: document.getElementById('children')?.innerText?.trim(),
    modal: document.getElementById('modal-slot')?.innerText?.trim(),
  }));
  console.log(`[${label}] url=${new URL(page.url()).pathname} children="${html.children}" modal="${html.modal}"`);
  await page.screenshot({ path: `${SHOT}/${tag}-${label}.png` });
};
await page.goto(base + '/');
await st('1-home');
await page.getByText('View my notifications').click();
await page.waitForTimeout(1500); await st('2-notifications-modal');
await page.getByText('View photo 1').click();
await page.waitForTimeout(1500); await st('3-photo-modal');
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(2500); await st('4-after-refresh');
await page.goBack();
await page.waitForTimeout(2500); await st('5-back-1');
await page.goBack();
await page.waitForTimeout(2500); await st('6-back-2');
await b.close();

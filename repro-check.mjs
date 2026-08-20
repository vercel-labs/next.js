import { chromium } from 'playwright';

const OUT = './screenshots';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => console.log('[console]', m.type(), m.text()));
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/01-initial.png`, fullPage: true });

async function probe(formIndex, label) {
  const form = page.locator('form').nth(formIndex);
  const btn = form.locator('button[type=submit]');
  console.log(`\n=== ${label} ===`);
  console.log('before click:', JSON.stringify(await btn.textContent()), 'disabled=', await btn.isDisabled());
  await btn.click();
  const samples = [];
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(100);
    samples.push(`${i * 100}ms text=${(await btn.textContent()).trim()} disabled=${await btn.isDisabled()}`);
  }
  console.log(samples.join('\n'));
  await page.screenshot({ path: `${OUT}/${label}-after.png`, fullPage: true });
  const sawPending = samples.some((s) => s.includes('Submitting...'));
  console.log(`RESULT ${label}: sawPending=${sawPending}`);
  await page.waitForTimeout(1500);
  return sawPending;
}

const inputPending = await probe(0, 'form-with-Input');
const selectPending = await probe(1, 'form-with-radix-Select');
const nativePending = await probe(2, 'form-with-native-select');
const triggerOnlyPending = await probe(3, 'form-radix-trigger-only');

// Confirm the select form's action actually ran (state updates)
const states = await page.locator('pre').allTextContents();
console.log('\nstate outputs:', JSON.stringify(states));

console.log(`\nSUMMARY input=${inputPending} radixSelect=${selectPending} nativeSelect=${nativePending} radixTriggerOnly=${triggerOnlyPending}`);
await browser.close();

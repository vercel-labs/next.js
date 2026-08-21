import { chromium } from "playwright";

const base = process.argv[2];
const label = process.argv[3];
const art = "/workspace/.next-maintainer/reproduction-artifacts/playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base, { waitUntil: "networkidle" });
await page.click("#boom");
await page.waitForFunction(() => window.__sentryEvent, null, { timeout: 15000 });
const ev = await page.evaluate(() => window.__sentryEvent);
await page.screenshot({ path: `${art}/${label}-sentry.png`, fullPage: true });
await browser.close();
const frames = ev.exception.values[0].stacktrace.frames.slice(-4);
console.log(`=== ${label}: Sentry event frames (top 4) ===`);
for (const f of frames.reverse()) {
  console.log(`${f.filename} :: ${f.function} ${f.lineno}:${f.colno} in_app=${f.in_app}`);
}
console.log("debug_meta:", JSON.stringify(ev.debug_meta ?? null));

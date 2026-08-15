// Headless verification: loads "/" 5 times in a fresh context and reports
// whether "Minified React error #310" is thrown by the App Router `Router`.
// Usage: npm run build && npm start &  then: node check.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
let hits = 0;

for (let i = 0; i < 5; i++) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.stack || e.message));
  await page.goto(base + "/", { waitUntil: "load" }).catch(() => {});
  await page.waitForTimeout(1500);
  const hit = errors.some((e) => /#310/.test(e));
  if (hit) hits++;
  console.log(`run ${i}: react#310 = ${hit}`);
  if (hit && i === 0) console.log(errors.find((e) => /#310/.test(e)));
  await ctx.close();
}

console.log(`\n${hits}/5 loads threw React error #310`);
await browser.close();
process.exit(hits > 0 ? 0 : 1);

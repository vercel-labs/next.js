// Counts "effect" console logs after a full page load (hydration) of "/".
import { chromium } from "playwright";

const port = process.argv[2] ?? "3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on("console", (m) => {
  if (m.text() === "effect") logs.push(m.text());
});
await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
console.log(`"effect" logs after hydration: ${logs.length} (expected 2 in StrictMode dev)`);
console.log("list text:", await page.textContent("ul"));
await browser.close();
process.exit(logs.length === 2 ? 0 : 1);

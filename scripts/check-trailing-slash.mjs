// Automated check: click the `/target/` link in the mixed (build-ID skewed)
// static export and assert the final URL keeps the configured trailing slash.
import { chromium } from "playwright";

const port = Number(process.env.REPRO_PORT || 8765);
const start = `http://localhost:${port}/assets/trip/next-test/`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage();
page.on("request", (request) => {
  const url = request.url();
  if (!url.includes("/_next/static")) {
    console.log("request:", request.method(), url);
  }
});

await page.goto(start, { waitUntil: "networkidle" });
console.log("before click:", page.url(), "|", await page.textContent("h1"));

await Promise.all([
  page.waitForNavigation({ waitUntil: "load" }),
  page.click("a.repro-link"),
]);
await page.waitForLoadState("networkidle");

const finalUrl = page.url();
console.log("after click :", finalUrl, "|", await page.textContent("h1"));
await browser.close();

const expected = `${start}target/`;
if (finalUrl !== expected) {
  console.error(`\nFAIL: expected ${expected} but got ${finalUrl}`);
  process.exit(1);
}
console.log("\nPASS: trailing slash preserved");

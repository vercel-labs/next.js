import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const hits = [];
page.on("request", (r) => {
  if (r.url().includes("/api/redirect")) hits.push(`${r.method()} ${r.url()}`);
});

// 1. client navigation to a Route Handler (still failing)
await page.goto(`${base}/from`, { waitUntil: "networkidle" });
await page.click("a");
await page.waitForTimeout(4000);
console.log(`[/from -> link click] requests to /api/redirect: ${hits.length}`);
console.log(hits.map((h) => "  " + h).join("\n"));

// 2. original repro: server-side redirect from "/" (fixed on 15/16)
hits.length = 0;
const page2 = await browser.newPage();
page2.on("request", (r) => {
  if (r.url().includes("/api/redirect")) hits.push(`${r.method()} ${r.url()}`);
});
await page2.goto(`${base}/`, { waitUntil: "networkidle" });
await page2.waitForTimeout(3000);
console.log(`[/ -> redirect()] requests to /api/redirect: ${hits.length}`);
console.log(hits.map((h) => "  " + h).join("\n"));

await browser.close();

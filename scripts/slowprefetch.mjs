import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:3003";
const DELAY = Number(process.env.DELAY || 5000);
const CLICK_AT = Number(process.env.CLICK_AT || 700);
const OUT = "/workspace/.next-maintainer/reproduction-artifacts/playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const t0 = Date.now();
const log = [];
// delay every /c/brands prefetch request by DELAY ms
await ctx.route("**/c/brands*", async (route) => {
  const req = route.request();
  const isPrefetch = req.headers()["next-router-prefetch"] === "1";
  log.push({ k: isPrefetch ? "PREFETCH-req" : "NAV-req", t: Date.now() - t0, seg: req.headers()["next-router-segment-prefetch"] });
  if (isPrefetch) await new Promise((r) => setTimeout(r, DELAY));
  await route.continue();
  log.push({ k: (isPrefetch ? "PREFETCH" : "NAV") + "-sent", t: Date.now() - t0 });
});
page.on("response", (r) => { if (r.url().includes("/c/brands")) log.push({ k: "res", t: Date.now() - t0, status: r.status() }); });
await page.goto(BASE + "/");
await page.waitForTimeout(CLICK_AT);
const clickT = Date.now() - t0;
log.push({ k: "CLICK", t: clickT });
await page.click("#brands");
const first = await Promise.race([page.waitForSelector("#brands-loading").then(()=>"loading-ui"), page.waitForSelector("#brands-list").then(()=>"content")]);
  console.log("FIRST PAINT of destination: " + first + " after " + (Date.now()-t0-clickT) + "ms");
  await page.waitForSelector("#brands-list", { timeout: 60000 });
const doneT = Date.now() - t0;
await page.screenshot({ path: OUT + "/brands-after-nav.png" });
for (const e of log) console.log(`  ${e.k} +${e.t}ms ${e.seg || ""} ${e.status ?? ""}`);
console.log(`RESULT: content visible +${doneT}ms => ${doneT - clickT}ms after click (prefetch delay=${DELAY}ms)`);
await browser.close();

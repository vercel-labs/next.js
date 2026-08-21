import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const TARGET = process.env.TARGET || "brands"; // link id
const CLICK_AT = Number(process.env.CLICK_AT || 300); // ms after load
const DONE = process.env.DONE || "#brands-list";

const browser = await chromium.launch();
const page = await browser.newPage();
const log = [];
const t0 = Date.now();
page.on("request", (r) => {
  const u = new URL(r.url());
  if (u.searchParams.has("_rsc"))
    log.push({ kind: "req", t: Date.now() - t0, path: u.pathname, seg: r.headers()["next-router-segment-prefetch"], pf: r.headers()["next-router-prefetch"] });
});
page.on("response", (r) => {
  const u = new URL(r.url());
  if (u.searchParams.has("_rsc")) log.push({ kind: "res", t: Date.now() - t0, path: u.pathname, status: r.status() });
});
await page.goto(BASE + "/");
await page.waitForTimeout(CLICK_AT);
const clickT = Date.now() - t0;
log.push({ kind: "CLICK", t: clickT });
await page.click("#" + TARGET);
await page.waitForSelector(DONE, { timeout: 60000 });
const doneT = Date.now() - t0;
console.log(`--- BASE=${BASE} target=${TARGET} clickAt=${clickT}ms`);
for (const e of log) console.log(`  ${e.kind} +${e.t}ms ${e.path || ""} ${e.seg || ""} ${e.status || ""} ${e.pf ? "prefetch=1" : e.kind === "req" ? "NAVIGATION" : ""}`);
console.log(`  CONTENT_VISIBLE +${doneT}ms  (=> ${doneT - clickT}ms after click)`);
await browser.close();

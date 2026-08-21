import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = process.env.OUT || "/workspace/.next-maintainer/reproduction-artifacts/playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const rsc = [];
page.on("request", (r) => {
  const u = new URL(r.url());
  if (u.searchParams.has("_rsc")) rsc.push({ t: Date.now(), path: u.pathname, url: r.url() });
});
const t0 = Date.now();
await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForTimeout(2500);
const prefetches = rsc.filter((r) => r.path === "/c/brands");
console.log("prefetch requests for /c/brands after load:", prefetches.length);
prefetches.forEach((p) => console.log("  +" + (p.t - t0) + "ms", p.url));

// click before prefetch completes
const clickAt = Date.now();
await page.click("#brands");
const shown = await Promise.race([
  page.waitForSelector("#brands-loading", { timeout: 20000 }).then(() => "loading-ui"),
  page.waitForSelector("#brands-list", { timeout: 20000 }).then(() => "full-content"),
]);
const delay = Date.now() - clickAt;
console.log(`first paint of destination: ${shown} after ${delay}ms`);
console.log("url after click:", page.url());
await page.screenshot({ path: OUT + "/after-click.png" });
await page.waitForSelector("#brands-list", { timeout: 30000 });
console.log("full content after", Date.now() - clickAt, "ms");
console.log("total /c/brands _rsc requests:", rsc.filter((r) => r.path === "/c/brands").length);
await browser.close();

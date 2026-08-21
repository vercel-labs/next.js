import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const t0 = Date.now();
page.on("request", (r) => {
  const u = new URL(r.url());
  if (!u.searchParams.has("_rsc")) return;
  const h = r.headers();
  console.log(`REQ +${Date.now()-t0}ms ${u.pathname}${u.search} prefetch=${h["next-router-prefetch"]} segment=${h["next-router-segment-prefetch"]} statetree=${h["next-router-state-tree"]?.slice(0,60)}`);
});
page.on("response", async (r) => {
  const u = new URL(r.url());
  if (!u.searchParams.has("_rsc")) return;
  console.log(`RES +${Date.now()-t0}ms ${r.status()} ${u.pathname} len=${(await r.body().catch(()=>({length:-1}))).length}`);
});
await page.goto(BASE + "/");
await page.waitForTimeout(3000);
await browser.close();

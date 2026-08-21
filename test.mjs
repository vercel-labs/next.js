import { chromium } from "playwright";
const B = "http://localhost:3000";
const AD = "./screenshots";
const b = await chromium.launch();
const p = await b.newPage();
const state = async (label) => {
  const modal = await p.locator("#modal").count();
  const full = await p.locator("#full-page").count();
  console.log(`${label}: url=${p.url().replace(B,"")} modal=${modal} fullPage=${full}`);
  await p.screenshot({ path: `${AD}/${label}.png` });
};
await p.goto(B);
await state("1-home");
await p.click("#to-signin");
await p.waitForSelector("#modal");
await state("2-after-link-nav-intercepted");
// hard reload -> full page
await p.goto(B + "/signin");
await state("3-direct-load-signin-full-page");
await p.click("#push-same");
await p.waitForTimeout(1500);
await state("4-after-push-same-route");
await b.close();

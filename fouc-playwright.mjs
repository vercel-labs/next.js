// Browser proof of the FOUC for https://github.com/vercel/next.js/issues/48505
// Requires: npm i -D playwright && npx playwright install chromium
// Usage: node fouc-playwright.mjs http://localhost:3000/ssr
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000/ssr";
const browser = await chromium.launch();

for (const run of [1, 2]) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 400 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  // Slow the CPU down so the pre-hydration paint is easy to observe.
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 20 });
  await page.addInitScript(() => {
    window.__early = null;
    const pick = () =>
      [...document.querySelectorAll("div")].find(
        (d) => d.textContent === "SSR page: Cool Styles" && d.children.length === 0,
      );
    const tick = () => {
      const el = pick();
      if (el && !window.__early) {
        window.__early = {
          boxShadow: getComputedStyle(el).boxShadow,
          color: getComputedStyle(el).color,
          emotionStyleTags: document.querySelectorAll("style[data-emotion]").length,
        };
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(url, { waitUntil: "commit" });
  await page.waitForSelector("div", { state: "attached" });
  await page.screenshot({ path: `request${run}-first-paint.png` });
  const early = await page.evaluate(() => window.__early);
  await page.waitForFunction(
    () => document.querySelectorAll("style[data-emotion]").length > 1 || performance.now() > 15000,
  );
  await page.waitForTimeout(500);
  await page.screenshot({ path: `request${run}-after-hydration.png` });
  const late = await page.evaluate(() => {
    const el = [...document.querySelectorAll("div")].find(
      (d) => d.textContent === "SSR page: Cool Styles" && d.children.length === 0,
    );
    return {
      boxShadow: getComputedStyle(el).boxShadow,
      color: getComputedStyle(el).color,
      emotionStyleTags: document.querySelectorAll("style[data-emotion]").length,
    };
  });
  console.log(`request${run} firstPaint=${JSON.stringify(early)}`);
  console.log(`request${run} hydrated  =${JSON.stringify(late)}`);
  await ctx.close();
}
await browser.close();

import { test, Page } from "@playwright/test";

const ART = "/workspace/.next-maintainer/reproduction-artifacts/playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";

async function sample(page: Page, selector: string, click: () => Promise<void>, frames = 60) {
  await click();
  const out: string[] = [];
  for (let i = 0; i < frames; i++) {
    const s = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return "missing";
      const r = el.getBoundingClientRect();
      return `${Math.round(r.x)}@${(el.parentElement as HTMLElement)?.id}`;
    }, selector);
    out.push(s);
    await page.waitForTimeout(50);
  }
  return out;
}

test("app router navigation: shared layoutId highlight", async ({ page }) => {
  await page.goto(`${BASE}/b`);
  await page.goto(`${BASE}/a`);
  await page.waitForSelector("#highlight");
  const s = await sample(page, "#highlight", () => page.click("#link-B"));
  await page.screenshot({ path: `${ART}/app-router-after-nav.png` });
  console.log("APP ROUTER:", s.join(" "));
});

test("control (useState tabs): shared layoutId highlight", async ({ page }) => {
  await page.goto(`${BASE}/control`);
  await page.waitForSelector("#control-highlight");
  const s = await sample(page, "#control-highlight", () => page.click("#tab-B"));
  await page.screenshot({ path: `${ART}/control-after-click.png` });
  console.log("CONTROL:", s.join(" "));
});

async function sampleBox(page: Page, click: () => Promise<void>, frames = 40) {
  await click();
  const out: string[] = [];
  for (let i = 0; i < frames; i++) {
    out.push(
      await page.evaluate(() => {
        const el = document.querySelector("#card") as HTMLElement | null;
        if (!el) return "missing";
        const r = el.getBoundingClientRect();
        return `${Math.round(r.width)}x${Math.round(r.height)}`;
      })
    );
    await page.waitForTimeout(50);
  }
  return out;
}

test("cross-route layoutId (App Router navigation)", async ({ page }) => {
  await page.goto(`${BASE}/cross/detail`);
  await page.goto(`${BASE}/cross`);
  await page.waitForSelector("#card");
  const s = await sampleBox(page, () => page.click("#open-detail"));
  await page.screenshot({ path: `${ART}/cross-route-after-nav.png` });
  console.log("CROSS ROUTE:", s.join(" "));
});

test("cross-route layoutId control (useState)", async ({ page }) => {
  await page.goto(`${BASE}/cross-control`);
  await page.waitForSelector("#card");
  const s = await sampleBox(page, () => page.click("#open-detail"));
  await page.screenshot({ path: `${ART}/cross-control-after-click.png` });
  console.log("CROSS CONTROL:", s.join(" "));
});

test("cross-route layoutId into async Server Component route", async ({ page }) => {
  await page.goto(`${BASE}/async/detail`);
  await page.goto(`${BASE}/async`);
  await page.waitForSelector("#card");
  const s = await sampleBox(page, () => page.click("#open-detail"));
  await page.screenshot({ path: `${ART}/async-route-after-nav.png` });
  console.log("ASYNC ROUTE:", s.join(" "));
});

test("AnimatePresence exit animation on route change (template.tsx)", async ({ page }) => {
  await page.goto(`${BASE}/exit/two`);
  await page.goto(`${BASE}/exit/one`);
  await page.waitForSelector("#page-one");
  await page.click("#to-two");
  const out: string[] = [];
  for (let i = 0; i < 20; i++) {
    out.push(
      await page.evaluate(() => {
        const one = document.querySelector("#page-one");
        const two = document.querySelector("#page-two");
        const wrappers = Array.from(document.querySelectorAll(".transition-wrapper"));
        const ops = wrappers
          .map((w) => `${(w.textContent || "").slice(0, 8)}=${getComputedStyle(w).opacity}`)
          .join(",");
        return `dom[one:${!!one},two:${!!two}] wrappers[${ops}]`;
      })
    );
    await page.waitForTimeout(50);
  }
  await page.screenshot({ path: `${ART}/exit-after-nav.png` });
  console.log("EXIT:", out.join(" "));
});

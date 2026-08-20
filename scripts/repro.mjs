// Drives the repro: the local broker (npm run broker) and the Next.js server
// (npm run dev / npm run start) must already be running.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = process.env.ARTIFACTS || "./playwright-out";
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log("[repro]", ...a);

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.on("console", (m) => {
  if (!m.text().includes("_next/hmr")) log("browser:", m.type(), m.text());
});
page.on("pageerror", (e) => log("pageerror:", e.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

// STEP 1: publish from the page that owns the connection until it round-trips.
let homeMessages = "messages: 0";
for (let i = 0; i < 15; i++) {
  await page.click("#publish");
  await page.waitForTimeout(500);
  homeMessages = (await page.textContent("#home-messages-count")) ?? "";
  if (homeMessages !== "messages: 0") break;
}
log("STEP 1 home page after publish ->", homeMessages, "|", await page.textContent("#home-client-state"));
await page.screenshot({ path: `${OUT}/1-home-works.png` });

// STEP 2: client-side navigation to a second page -> useMqtt cleanup runs
// client.end(), so the shared client is dead on the new page.
await page.click("#to-other");
await page.waitForSelector("#client-state");
await page.waitForTimeout(1500);
log("STEP 2 shared client state on /other ->", await page.textContent("#client-state"));
await page.click("#publish-other");
await page.waitForTimeout(2500);
log("STEP 2 publish from /other ->", await page.textContent("#publish-result"));
await page.screenshot({ path: `${OUT}/2-other-client-ended.png` });

await browser.close();

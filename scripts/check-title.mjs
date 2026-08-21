// Samples document.title after load and prints every <title> element in <head>.
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3002";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });

for (let i = 1; i <= 5; i++) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const samples = [];
  await page.goto(url, { waitUntil: "commit" });
  const t0 = Date.now();
  while (Date.now() - t0 < 3000) {
    samples.push([Date.now() - t0, await page.title().catch(() => null)]);
    await page.waitForTimeout(20);
  }
  const changes = samples.filter((s, i) => i === 0 || s[1] !== samples[i - 1][1]);
  console.log(
    `run ${i}: ` + changes.map(([t, v]) => `${t}ms="${v}"`).join(" -> ")
  );
  if (i === 1) {
    console.log(
      "head <title> elements in order: " +
        JSON.stringify(
          await page.evaluate(() =>
            Array.from(document.querySelectorAll("head title")).map((t) => t.textContent)
          )
        )
    );
  }
  await ctx.close();
}

await browser.close();

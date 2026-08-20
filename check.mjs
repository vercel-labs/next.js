import { chromium } from "playwright";
const OUT = "/workspace/.next-maintainer/reproduction-artifacts/playwright";
const b = await chromium.launch();
for (const [label, base] of [["dev","http://localhost:3000"],["prod","http://localhost:3001"]]) {
  for (const p of ["a","b"]) {
    const page = await b.newPage();
    await page.goto(`${base}/${p}`, { waitUntil: "networkidle" });
    const bg = await page.$eval("#box", el => getComputedStyle(el).backgroundColor);
    console.log(`${label} /${p} #box background = ${bg}`);
    await page.screenshot({ path: `${OUT}/${label}-${p}.png` });
    await page.close();
  }
}
await b.close();

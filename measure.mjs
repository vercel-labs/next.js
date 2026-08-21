// Measures the gap between the Suspense children rendering and the fallback being removed.
// Usage: node measure.mjs http://localhost:3002 "fetch" "timeout 50"
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3002";
const links = process.argv.slice(3).length ? process.argv.slice(3) : ["fetch", "timeout 50", "timeout 1000"];
const browser = await chromium.launch();
for (const linkText of links) {
  const page = await (await browser.newContext()).newPage();
  const logs = [];
  page.on("console", (m) => m.text().startsWith("[") && logs.push({ t: Date.now(), text: m.text() }));
  await page.goto(base + "/?mode=timeout&ms=1000", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  logs.length = 0;
  await page.getByText(linkText, { exact: true }).click();
  await page.waitForTimeout(3000);
  const fbMount = logs.find((l) => l.text.includes("[SuspenseComponent] mount"));
  const render = logs.find((l) => l.text.includes("[ClientComponent] render"));
  const fbUnmount = logs.find((l) => l.text.includes("[SuspenseComponent] unmount") && (!render || l.t >= render.t));
  console.log(
    `${linkText}: children rendered -> fallback removed = ${render && fbUnmount ? fbUnmount.t - render.t : "n/a"}ms, fallback visible = ${fbMount && fbUnmount ? fbUnmount.t - fbMount.t : "n/a"}ms`
  );
  await page.context().close();
}
await browser.close();

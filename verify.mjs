import { chromium } from "playwright";
const base = process.env.BASE || "http://localhost:3000";
const out = process.env.OUT || "/workspace/.next-maintainer/reproduction-artifacts/playwright";
const b = await chromium.launch();
const ctx = await b.newContext();
const page = await ctx.newPage();
const seen = [];
page.on("response", async (r) => {
  const u = r.url();
  if (!u.endsWith(".js")) return;
  let body = "";
  try { body = await r.text(); } catch {}
  seen.push({ u, size: body.length, moment: body.includes("MOMENT_CC_FINGERPRINT"), jquery: body.includes("JQUERY_CC_FINGERPRINT") });
});

async function report(label) {
  seen.length = 0;
  await page.goto(base, { waitUntil: "networkidle" });
  console.log(`--- ${label}`);
  console.log("body text:", (await page.locator("main").innerText()).replace(/\n/g, " | "));
  for (const s of seen) if (s.moment || s.jquery)
    console.log(`  ${s.u.split("/").pop()} ${(s.size/1024).toFixed(0)}kB moment=${s.moment} jquery=${s.jquery}`);
  const total = seen.reduce((a, s) => a + s.size, 0);
  console.log(`  total JS bytes: ${(total/1024).toFixed(0)}kB across ${seen.length} files`);
  await page.screenshot({ path: `${out}/${label}.png`, fullPage: false });
}

await report("initial-no-client-components");
await page.getByRole("button", { name: /moment/ }).click();
await page.waitForTimeout(1500);
await report("only-moment-rendered");
await b.close();

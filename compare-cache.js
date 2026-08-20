// Compares warm-cache reload vs cache-bypass (hard) reload on the same page.
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const fs = require("fs");
const URL_ = process.argv[2] || "http://localhost:3200/";
const LABEL = process.argv[3] || "dev";
const redRatio = (b) => { const p = PNG.sync.read(b); let r=0,n=0;
  for (let y=0;y<p.height;y+=9) for (let x=0;x<p.width;x+=9){const i=(p.width*y+x)<<2;n++;
    if (p.data[i]>200&&p.data[i+1]<60&&p.data[i+2]<60) r++;} return r/n; };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Page.enable");
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  for (const bypass of [false, true]) {
    const fr = [];
    const h = async (e) => { fr.push({ ts: e.metadata.timestamp, data: Buffer.from(e.data, "base64") });
      try { await cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }); } catch {} };
    cdp.on("Page.screencastFrame", h);
    await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
    await Promise.all([page.waitForEvent("load"), cdp.send("Page.reload", { ignoreCache: bypass })]);
    await page.waitForTimeout(2500);
    await cdp.send("Page.stopScreencast");
    cdp.off("Page.screencastFrame", h);
    const t0 = fr[0].ts;
    const rows = fr.map((f, i) => ({ t: Math.round((f.ts - t0) * 1000), red: +redRatio(f.data).toFixed(2) }));
    const dir = `frames-${LABEL}-${bypass ? "hardreload" : "reload"}`;
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    fr.forEach((f, i) => fs.writeFileSync(`${dir}/${i}.png`, f.data));
    console.log(LABEL, bypass ? "hard reload (cache bypass)" : "normal reload (warm cache)",
      JSON.stringify(rows), "fullRedFrames=", rows.filter((r) => r.red > 0.9).length);
    await page.waitForTimeout(1500);
  }
  await browser.close();
})();

// Reloads the page with a warm HTTP cache and records every painted frame.
// A frame that is (almost) pure red = the body background is visible, i.e. a flash.
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const fs = require("fs");

const URL_ = process.argv[2] || "http://localhost:3200/";
const LABEL = process.argv[3] || "dev";
const LATENCY = Number(process.env.LATENCY_MS || 0); // emulate RTT
const OUT = process.env.OUT_DIR || `frames-${LABEL}`;

const isRed = (buf) => {
  const p = PNG.sync.read(buf);
  let red = 0, n = 0;
  for (let y = 0; y < p.height; y += 9)
    for (let x = 0; x < p.width; x += 9) {
      const i = (p.width * y + x) << 2;
      n++;
      if (p.data[i] > 200 && p.data[i + 1] < 60 && p.data[i + 2] < 60) red++;
    }
  return red / n;
};

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (LATENCY) {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false, latency: LATENCY, downloadThroughput: 5e6, uploadThroughput: 1e6,
    });
  }
  await page.goto(URL_, { waitUntil: "load" }); // first visit: fills the browser cache
  await page.waitForTimeout(3000);

  const frames = [];
  cdp.on("Page.screencastFrame", async (e) => {
    frames.push({ ts: e.metadata.timestamp, data: Buffer.from(e.data, "base64") });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }); } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
  await page.reload({ waitUntil: "load" }); // step 2 of the issue: refresh
  await page.waitForTimeout(2500);
  await cdp.send("Page.stopScreencast");

  const info = await page.evaluate(() => {
    const paint = {};
    performance.getEntriesByType("paint").forEach((e) => (paint[e.name] = Math.round(e.startTime)));
    const img = document.querySelector("img");
    return {
      paint,
      blurResource: performance
        .getEntriesByType("resource")
        .filter((r) => r.name.includes("w=8") || r.name.includes("blur"))
        .map((r) => ({ url: r.name.slice(-60), start: Math.round(r.startTime), end: Math.round(r.responseEnd) })),
      inlineBlur: img ? /data:image/.test(getComputedStyle(img).backgroundImage) : null,
    };
  });

  const t0 = frames.length ? frames[0].ts : 0;
  const rows = frames.map((f, i) => {
    fs.writeFileSync(`${OUT}/${LABEL}-${String(i).padStart(2, "0")}.png`, f.data);
    return { i, t_ms: Math.round((f.ts - t0) * 1000), redRatio: +isRed(f.data).toFixed(3) };
  });
  const flashes = rows.filter((r) => r.redRatio > 0.9);
  console.log(JSON.stringify({ label: LABEL, latencyMs: LATENCY, url: URL_, ...info, frames: rows,
    flashFrames: flashes.length, flashFrameTimes: flashes.map((f) => f.t_ms) }, null, 1));
  await browser.close();
})();

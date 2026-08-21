// Size sweep: how the next/image blur placeholder paint cost scales with painted area.
// Usage: node measure-variants.mjs [baseUrl]
import { firefox, chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3000';
for (const [bt, name] of [[firefox, 'firefox'], [chromium, 'chromium']]) {
  const b = await bt.launch();
  for (const [w, h] of [[300, 150], [600, 300], [1200, 600], [2400, 1200]]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await p.goto(`${base}/blur-stall.html?v=next&w=${w}&h=${h}&r=${Math.random()}`);
    console.log(name, JSON.stringify(await p.evaluate(() => window.done)));
    await p.close();
  }
  await b.close();
}

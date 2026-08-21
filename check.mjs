import { chromium } from "playwright";
import { SourceMapConsumer } from "source-map";

const base = process.argv[2];
const label = process.argv[3];
const art = "/workspace/.next-maintainer/reproduction-artifacts/playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base, { waitUntil: "networkidle" });
await page.click("#boom");
const stack = await page.evaluate(() => window.__stack);
await page.screenshot({ path: `${art}/${label}.png`, fullPage: true });
await browser.close();

console.log(`=== ${label} raw stack ===\n${stack}\n`);

const frames = [...stack.matchAll(/\((https?:\/\/[^)\s]+?):(\d+):(\d+)\)/g)].map((m) => ({
  url: m[1],
  line: +m[2],
  col: +m[3],
}));
for (const f of frames.slice(0, 4)) {
  const js = await fetch(f.url).then((r) => r.text());
  const m = /[/][/]# sourceMappingURL=(.*)/.exec(js);
  console.log(`frame ${f.url}:${f.line}:${f.col} -> sourceMappingURL=${m ? m[1] : "MISSING"}`);
  if (!m) continue;
  const mapUrl = new URL(m[1], f.url).href;
  const res = await fetch(mapUrl);
  console.log(`  map fetch ${mapUrl} -> ${res.status}`);
  if (!res.ok) continue;
  const map = await res.json();
  const consumer = await new SourceMapConsumer(map);
  const pos = consumer.originalPositionFor({ line: f.line, column: f.col });
  console.log(`  original: ${pos.source}:${pos.line}:${pos.column} name=${pos.name}`);
  consumer.destroy();
}

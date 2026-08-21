// Usage: npm run dev (in another shell), then: node scripts/verify.mjs [port] [iterations]
// Writes a new border-radius value to app/globals.css, waits, then compares the
// value on disk with the value inside the CSS chunk the dev server serves.
import fs from "node:fs";
import path from "node:path";

const port = process.argv[2] ?? "3000";
const iterations = Number(process.argv[3] ?? 3);
const cssFile = path.join(process.cwd(), "app", "globals.css");
const base = `http://localhost:${port}`;

const html = await (await fetch(base, { cache: "no-store" })).text();
const href = html.match(/href="([^"]+\.css[^"]*)"/)?.[1];
if (!href) throw new Error("no CSS chunk found in served HTML");
const cssUrl = href.startsWith("http") ? href : base + href;
console.log("css chunk:", cssUrl);

const write = (v) => {
  const next = fs
    .readFileSync(cssFile, "utf8")
    .replace(/(border-radius:\s*)\d+px/, `$1${v}px`);
  const tmp = cssFile + ".tmp";
  fs.writeFileSync(tmp, next);
  fs.renameSync(tmp, cssFile); // single atomic write event
};
const servedRadius = async () => {
  const css = await (await fetch(cssUrl, { cache: "no-store" })).text();
  return css.match(/\.hero\s*\{[^}]*?border-radius:\s*(\d+px)/s)?.[1] ?? "none";
};

let stale = 0;
for (let i = 0; i < iterations; i++) {
  const value = `${71 + i}px`;
  write(71 + i);
  await new Promise((r) => setTimeout(r, 7000)); // isolated save, no debounce effects
  const served = await servedRadius();
  const ok = served === value;
  if (!ok) stale++;
  console.log(`disk=${value} served=${served} ${ok ? "OK" : "STALE"}`);
}
console.log(`\nstale: ${stale}/${iterations}`);
process.exit(stale ? 1 : 0);

// Flips `.hero { border-radius }` in app/globals.css and polls the dev server's
// served CSS chunk. A MISS means the served CSS is still the previous revision.
import fs from "node:fs";
import path from "node:path";

const base = process.env.URL ?? "http://localhost:3000";
const timeoutMs = Number(process.env.TIMEOUT ?? 10000);
const file = path.join(process.cwd(), "app", "globals.css");
const re = /(\.hero\s*\{[^}]*?border-radius:\s*)(\d+px)/s;

const read = () => fs.readFileSync(file, "utf8");
const write = (v) => {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, read().replace(re, (_m, p1) => p1 + v));
  fs.renameSync(tmp, file); // atomic rename, like most editors
};

const cssUrls = async () => {
  const html = await (await fetch(base, { cache: "no-store" })).text();
  return [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) =>
    m[1].startsWith("http") ? m[1] : new URL(m[1], base).href,
  );
};
const served = async (urls) => {
  for (const u of urls) {
    const css = await (await fetch(u, { cache: "no-store" })).text();
    const m = css.match(re);
    if (m) return m[2];
  }
  return null;
};

const urls = await cssUrls();
console.log(`url=${base} chunks=${urls.length} timeout=${timeoutMs}ms`);
let misses = 0;
const start = Number(read().match(re)[2].replace("px", ""));
for (let i = 1; i <= 4; i++) {
  const want = `${start + i}px`; // strictly increasing, so an OK can never be accidental
  write(want);
  const deadline = Date.now() + timeoutMs;
  let last = null;
  while (Date.now() < deadline) {
    last = await served(urls);
    if (last === want) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const ok = last === want;
  if (!ok) misses++;
  console.log(`[${i}/4] saved ${want} -> served ${last} ${ok ? "OK" : "MISS (stale)"}`);
}
write(`${start}px`);
console.log(`misses: ${misses}/4`);
process.exit(misses > 0 ? 1 : 0);

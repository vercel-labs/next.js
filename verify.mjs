// Boots `next dev`, fetches "/", and prints the two tagged-template payloads.
import { spawn } from "node:child_process";
const port = process.env.PORT || "3100";
const dev = spawn("npx", ["next", "dev", "-p", port], { stdio: ["ignore", "inherit", "inherit"] });
const url = `http://localhost:${port}/`;
let html = "";
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 2000));
  try {
    const res = await fetch(url);
    if (res.ok) { html = await res.text(); break; }
  } catch {}
}
dev.kill("SIGKILL");
const pres = [...html.matchAll(/<pre>(.*?)<\/pre>/gs)].map((m) =>
  m[1].replace(/<!-- -->/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
);
console.log("\n--- rendered tagged template args ---");
pres.forEach((p) => console.log(p));
const bad = pres.some((p) => p.includes("gap") && p.includes("display: inline-flex"));
console.log(bad ? "\nBUG: component A's CSS leaked into component B's template strings" : "\nOK: templates are not mixed");
process.exit(bad ? 1 : 0);

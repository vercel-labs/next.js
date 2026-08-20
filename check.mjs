// Greps the built client chunks for the two client-component fingerprints.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = ".next/static/chunks";
const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) files.push(p);
  }
})(root);

for (const f of files) {
  const src = readFileSync(f, "utf8");
  const m = src.includes("MOMENT_CC_FINGERPRINT");
  const j = src.includes("JQUERY_CC_FINGERPRINT");
  if (m || j)
    console.log(
      `${f}  ${(statSync(f).size / 1024).toFixed(0)}kB  moment=${m} jquery=${j}`
    );
}

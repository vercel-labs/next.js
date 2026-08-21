// Parses every emitted client chunk with acorn at ecmaVersion 2021 (the newest
// syntax level iOS 15 Safari fully supports). Any failure means iOS 15 Safari
// throws SyntaxError before React hydrates, so no event handler ever fires.
import fs from "node:fs";
import path from "node:path";
import * as acorn from "acorn";

const dir = path.join(".next", "static", "chunks");
if (!fs.existsSync(dir)) {
  console.error("Run `next build` first.");
  process.exit(2);
}

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );

let failed = 0;
for (const file of walk(dir).filter((f) => f.endsWith(".js"))) {
  const src = fs.readFileSync(file, "utf8");
  try {
    acorn.parse(src, { ecmaVersion: 2021, sourceType: "script" });
  } catch (e) {
    failed++;
    const idx = src.indexOf("static{");
    console.log(`FAIL (ES2021) ${file}: ${e.message}`);
    if (idx !== -1) console.log(`  static block: ...${src.slice(idx - 90, idx + 90)}...`);
  }
}
console.log(failed ? `\n${failed} chunk(s) contain post-ES2021 syntax` : "\nall chunks parse as ES2021");
process.exit(failed ? 1 : 0);

// Generates src/big.mjs — a module holding one oversized `new URL(<data URI>, import.meta.url)`.
//   node generate.mjs           # 13,280,481 chars — the real-world size, hangs
//   node generate.mjs 8388572   # largest length that still works
//   node generate.mjs 8388573   # one char more — hangs
import { mkdirSync, writeFileSync } from "node:fs";

const PREFIX = "data:application/wasm;base64,";
const total = Number(process.argv[2] ?? 13_280_481);
const uri = PREFIX + "A".repeat(total - PREFIX.length);

mkdirSync("src", { recursive: true });
writeFileSync(
  "src/big.mjs",
  `export const wasmUrl = new URL(${JSON.stringify(uri)}, import.meta.url).href;\n`
);
console.log(`wrote src/big.mjs — data URI length ${uri.length}`);

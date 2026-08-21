// Inspects .next/standalone layout after `next build` (Turbopack) vs `next build --webpack`.
import { existsSync, readdirSync, lstatSync, readlinkSync } from "node:fs";

const list = (p) => (existsSync(p) ? readdirSync(p) : null);
const top = list(".next/standalone/node_modules");
const inner = list(".next/standalone/.next/node_modules");

console.log(".next/standalone/node_modules:", top);
console.log(".next/standalone/.next/node_modules:", inner);
for (const e of inner ?? []) {
  const p = `.next/standalone/.next/node_modules/${e}`;
  if (lstatSync(p).isSymbolicLink()) console.log(`  ${e} ->`, readlinkSync(p));
}
const ok = (top ?? []).includes("ts-deepmerge");
console.log(
  ok
    ? "PASS: serverExternalPackages entry present in .next/standalone/node_modules"
    : "FAIL: ts-deepmerge missing from .next/standalone/node_modules (only hashed symlink under .next/standalone/.next/node_modules)"
);
process.exit(ok ? 0 : 1);

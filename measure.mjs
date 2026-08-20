// Measures how much of react-icons vs lucide-react ends up in the dev bundles.
// Usage: start `npm run dev` (or `npm run dev:webpack`), open http://localhost:3000, then `npm run measure`.
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

const files = walk(".next/dev").concat(walk(".next/static"), walk(".next/server"));
let icons = 0, lucide = 0;
for (const f of files) {
  const size = statSync(f).size;
  const src = readFileSync(f, "utf8");
  // "FaZhihu" / "Bs1SquareFill" are icons that are NOT imported by app/page.tsx
  if (src.includes("FaZhihu") || src.includes("Bs1SquareFill")) icons += size;
  if (/node_modules[\\/]lucide-react/.test(src) || f.includes("lucide-react")) lucide += size;
}
const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
console.log("chunks containing NON-imported react-icons icons:", mb(icons));
console.log("chunks containing lucide-react:                  ", mb(lucide));

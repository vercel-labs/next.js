// Grows the app to N nested dynamic routes, so the dev cache is large enough to
// be worth measuring and large enough for a kill to land mid-write. A route that
// costs nothing to compile gives the cache nothing to write.
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = dirname(fileURLToPath(import.meta.url))
const N = Number(process.argv[2] ?? 300)
const GEN = join(ROOT, "app/api/gen")

if (existsSync(GEN)) rmSync(GEN, { recursive: true })

// Each route pulls a shared module tree so compiling one is not free — a route
// that costs nothing to build gives the cache nothing to truncate.
mkdirSync(join(ROOT, "lib"), { recursive: true })
writeFileSync(
  join(ROOT, "lib/heavy.ts"),
  Array.from({ length: 40 }, (_, i) => `export const c${i} = ${JSON.stringify(Array.from({ length: 120 }, (_, j) => `row-${i}-${j}`))}\n`).join(""),
)

for (let i = 0; i < N; i++) {
  const dir = join(GEN, `g${i}`, "[id]", "detail")
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, "route.ts"),
    `import * as heavy from "../../../../../../lib/heavy"\n` +
      `export async function GET() {\n  return Response.json({ g: ${i}, n: Object.keys(heavy).length })\n}\n`,
  )
  // a parent alongside each child, so we can see the reported shape:
  // nested 404s while the parent still 200s
  const parent = join(GEN, `g${i}`, "[id]")
  writeFileSync(
    join(parent, "route.ts"),
    `export async function GET() { return Response.json({ g: ${i}, level: "parent" }) }\n`,
  )
}
console.log(`generated ${N} parent+nested route pairs under app/api/gen (${N * 2} route files)`)

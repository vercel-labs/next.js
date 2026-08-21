// Measures WHEN the Turbopack dev cache is written: during compilation, on idle,
// or at shutdown. It decides where a signal can interrupt a write, so it is the
// one worth checking first.
//
//   node scale.mjs 60 && node characterize.mjs
//
// Exits 2 rather than printing a table if the measurement could not be taken —
// a run that boots on a different port, or whose requests never land, would
// otherwise report a flat cache and read exactly like a finding.
import { spawn, execFileSync } from "node:child_process"
import { rmSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT ?? 3100)
const ORIGIN = `http://localhost:${PORT}`
const WARM = Number(process.env.WARM ?? 60)
const IDLE_S = Number(process.env.IDLE_S ?? 30)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const cacheKb = () => {
  try {
    return Number(
      execFileSync("du", ["-sk", join(ROOT, ".next/dev/cache")], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\t")[0],
    )
  } catch {
    return 0
  }
}
const human = (kb) => (kb > 1024 ? `${(kb / 1024).toFixed(0)} MB` : `${kb} KB`)
const row = (label, kb) => console.log(`  ${label.padEnd(34)} ${human(kb).padStart(8)}`)

// Kill the whole process group: `next dev` spawns a `next-server` child that
// outlives its parent. Matching on a process name instead would also match an
// unrelated dev server the person running this has open.
let server = null
const killGroup = (signal) => {
  if (!server?.pid) return
  try {
    process.kill(-server.pid, signal)
  } catch {}
}

const die = (why) => {
  console.error(`\n  INSTRUMENT DEAD: ${why}\n  No table printed; the numbers would not mean anything.\n`)
  killGroup("SIGKILL")
  process.exit(2)
}

const main = async () => {
  rmSync(join(ROOT, ".next"), { recursive: true, force: true })

  server = spawn("npx", ["next", "dev", "-p", String(PORT)], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], detached: true })
  let out = ""
  server.stdout.on("data", (d) => (out += d))
  server.stderr.on("data", (d) => (out += d))
  for (let i = 0; i < 120 && !/Ready in|started server/i.test(out); i++) await sleep(500)

  if (!/Ready in|started server/i.test(out)) die(`dev server never reported ready in 60s\n${out.slice(-400)}`)
  // Next silently falls back to a free port when the requested one is taken, and
  // still says "Ready". Every request below would then miss, and the cache would
  // stay flat for a reason that has nothing to do with the cache.
  if (!out.includes(`:${PORT}`)) die(`dev server did not bind ${PORT} (port in use?)\n${out.slice(-400)}`)

  console.log(`\n  next ${execFileSync("node", ["-p", "require('./node_modules/next/package.json').version"], { cwd: ROOT, encoding: "utf8" }).trim()}\n`)
  row("after boot", cacheKb())

  let served = 0
  for (let i = 0; i < WARM; i++) {
    try {
      if ((await fetch(`${ORIGIN}/api/gen/g${i}/x/detail`)).ok) served++
    } catch {}
  }
  if (served < WARM / 2) die(`only ${served}/${WARM} routes compiled — run \`node scale.mjs ${WARM}\` first`)
  row(`after compiling ${WARM} routes`, cacheKb())

  // The point of the whole script: watch it land while nothing is happening.
  // Sampled every 500ms because the batch turns out to complete in seconds, not
  // tens of seconds, which is what makes the window easy to land a kill in.
  let prev = cacheKb()
  const t0 = Date.now()
  let settledAt = null
  for (let i = 0; i < IDLE_S * 2; i++) {
    await sleep(500)
    const now = cacheKb()
    const dt = ((Date.now() - t0) / 1000).toFixed(1)
    if (now !== prev) row(`t+${dt}s idle  (moving)`, now)
    else if (settledAt === null && now > 8) {
      settledAt = dt
      row(`t+${dt}s idle  (settled)`, now)
    }
    prev = now
  }
  if (settledAt === null) die("cache never moved while idle — nothing was measured")

  killGroup("SIGTERM")
  await sleep(6000)
  row("after graceful SIGTERM", cacheKb())
  killGroup("SIGKILL")

  console.log(`\n  If the cache is flat while routes compile and jumps while idle, the`)
  console.log(`  window where a signal can interrupt a write is the idle flush.\n`)
}

await main()
process.exit(0)

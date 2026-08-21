import { spawn } from "node:child_process"
import { existsSync, renameSync, readFileSync, writeFileSync, utimesSync, rmSync } from "node:fs"
import { execFileSync } from "node:child_process"
const ROOT = process.cwd()
const PORT = 3200
const LOGDIR = process.cwd()
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const NESTED = `${ROOT}/app/api/a/[id]/detail/route.ts`
const STASH = `${ROOT}/stash-route.ts`

async function boot(tag) {
  const log = `${LOGDIR}/${tag}.log`
  const fs = await import("node:fs")
  const fd = fs.openSync(log, "w")
  const p = spawn("npx", ["next", "dev", "-p", String(PORT)], { cwd: ROOT, stdio: ["ignore", fd, fd], detached: true })
  for (let i = 0; i < 120; i++) { await sleep(500); if (/Ready in/.test(fs.readFileSync(log,"utf8"))) break }
  return p
}
const kill = (p, s="SIGTERM") => { try { process.kill(-p.pid, s) } catch {} }
async function probe(path) {
  try { const r = await fetch(`http://localhost:${PORT}${path}`); return `${r.status} ${r.headers.get("content-type")}` }
  catch (e) { return "ERR " + e.message }
}
const manifest = () => { try { return Object.keys(JSON.parse(readFileSync(`${ROOT}/.next/dev/server/app-paths-manifest.json`,"utf8"))).filter(k=>k.includes("detail")) } catch { return "n/a" } }

const step = async (tag, note) => {
  const p = await boot(tag)
  console.log(`\n== ${tag}: ${note}`)
  console.log("  parent :", await probe("/api/a/x"))
  console.log("  nested :", await probe("/api/a/x/detail"))
  console.log("  sha256 :", existsSync(NESTED) ? execFileSync("sha256sum",[NESTED],{encoding:"utf8"}).split(" ")[0] : "MISSING")
  console.log("  mtime  :", existsSync(NESTED) ? execFileSync("stat",["-c","%y",NESTED],{encoding:"utf8"}).trim() : "-")
  console.log("  manifest detail keys:", JSON.stringify(manifest()))
  await sleep(5000) // let idle flush land
  kill(p); await sleep(4000); kill(p,"SIGKILL"); await sleep(500)
  return p
}

rmSync(`${ROOT}/.next`, {recursive:true, force:true})
// run 1: everything present, warm the persistent cache
await step("run1-warm", "nested route present")
// run 2: nested route absent (like a branch that doesn't have it)
renameSync(NESTED, STASH)
await step("run2-absent", "nested route removed on disk")
// run 3: restore file bytes but with an OLD mtime (like a worktree copy / cp -p / merge preserving times)
renameSync(STASH, NESTED)
const old = new Date("2021-01-01T00:00:00Z")
utimesSync(NESTED, old, old)
await step("run3-old-mtime", "nested route restored with mtime in 2021")

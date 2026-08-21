import { spawn } from "node:child_process"
import fs from "node:fs"
const ROOT = process.cwd()
const PORT = 3202
const LOG = `${process.cwd()}/overflow.log`
const sleep = ms => new Promise(r => setTimeout(r, ms))
const probe = async p => { try { const r = await fetch(`http://localhost:${PORT}${p}`); return `${r.status} ${(r.headers.get("content-type")||"").split(";")[0]}` } catch(e){ return "ERR" } }
const src = l => `export async function GET() { return Response.json({ level: ${JSON.stringify(l)} }) }\n`

fs.rmSync(`${ROOT}/.next`, {recursive:true,force:true})
const fd = fs.openSync(LOG, "w")
const p = spawn("npx", ["next","dev","-p",String(PORT)], {cwd:ROOT, stdio:["ignore",fd,fd], detached:true})
for (let i=0;i<120;i++){ await sleep(500); if(/Ready in/.test(fs.readFileSync(LOG,"utf8"))) break }
console.log("booted. parent:", await probe("/api/a/x"), "existing nested:", await probe("/api/a/x/detail"))

const NAME = "churned"
const dir = `${ROOT}/app/api/a/[id]/${NAME}`
fs.rmSync(dir, {recursive:true, force:true})
console.log("pre-create probe:", await probe(`/api/a/x/${NAME}`))

// churn: thousands of events inside the watched tree to overflow the inotify queue
const churn = `${ROOT}/app/churn`
fs.mkdirSync(churn, {recursive:true})
for (let i=0;i<20000;i++) fs.writeFileSync(`${churn}/f${i}.txt`, "x")
fs.rmSync(churn, {recursive:true, force:true})
console.log("churn done")

// now add the nested route (its event may be dropped after overflow)
fs.mkdirSync(dir, {recursive:true})
fs.writeFileSync(`${dir}/route.ts`, src("churned"))
for (const t of [3,6,10,15]) { await sleep(t*1000 - (t>3?(t-3)*1000:0)); console.log(`t+${t}s after create:`, await probe(`/api/a/x/${NAME}`), "onDisk:", fs.existsSync(`${dir}/route.ts`)) }

const now = new Date(); fs.utimesSync(`${dir}/route.ts`, now, now)
await sleep(4000)
console.log("after touch (identical bytes):", await probe(`/api/a/x/${NAME}`))
try { const m = JSON.parse(fs.readFileSync(`${ROOT}/.next/dev/server/app-paths-manifest.json`,"utf8")); console.log("manifest keys:", Object.keys(m)) } catch {}
try { process.kill(-p.pid,"SIGKILL") } catch {}

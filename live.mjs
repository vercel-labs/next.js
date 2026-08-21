import { spawn, execFileSync } from "node:child_process"
import fs from "node:fs"
const ROOT = process.cwd()
const PORT = 3201
const LOG = `${process.cwd()}/live.log`
const sleep = ms => new Promise(r => setTimeout(r, ms))
const probe = async p => { try { const r = await fetch(`http://localhost:${PORT}${p}`); return `${r.status} ${(r.headers.get("content-type")||"").split(";")[0]}` } catch(e){ return "ERR" } }
const ROUTE = n => `${ROOT}/app/api/a/[id]/${n}`
const src = l => `export async function GET() { return Response.json({ level: ${JSON.stringify(l)} }) }\n`

fs.rmSync(`${ROOT}/.next`, {recursive:true,force:true})
const fd = fs.openSync(LOG, "w")
const p = spawn("npx", ["next","dev","-p",String(PORT)], {cwd:ROOT, stdio:["ignore",fd,fd], detached:true})
for (let i=0;i<120;i++){ await sleep(500); if(/Ready in/.test(fs.readFileSync(LOG,"utf8"))) break }
console.log("booted")
console.log("parent:", await probe("/api/a/x"))
console.log("existing nested:", await probe("/api/a/x/detail"))

async function variant(name, mk) {
  const dir = ROUTE(name)
  // 1. probe BEFORE creating, so a negative result is cached
  const before = await probe(`/api/a/x/${name}`)
  mk(dir)
  await sleep(2500)
  const after = await probe(`/api/a/x/${name}`)
  // touch to current time
  const now = new Date(); fs.utimesSync(`${dir}/route.ts`, now, now)
  await sleep(2500)
  const touched = await probe(`/api/a/x/${name}`)
  console.log(`${name.padEnd(22)} pre=${before.padEnd(16)} after-create=${after.padEnd(16)} after-touch=${touched}`)
}

await variant("v1now", d => { fs.mkdirSync(d,{recursive:true}); fs.writeFileSync(`${d}/route.ts`, src("v1")) })
await variant("v2old", d => { fs.mkdirSync(d,{recursive:true}); fs.writeFileSync(`${d}/route.ts`, src("v2")); const o=new Date("2021-01-01"); fs.utimesSync(`${d}/route.ts`,o,o); fs.utimesSync(d,o,o) })
await variant("v3atomicold", d => {
  const tmp = `${ROOT}/.tmp-${Date.now()}`; fs.mkdirSync(tmp,{recursive:true})
  fs.writeFileSync(`${tmp}/route.ts`, src("v3")); const o=new Date("2021-01-01"); fs.utimesSync(`${tmp}/route.ts`,o,o); fs.utimesSync(tmp,o,o)
  fs.renameSync(tmp, d)
})
try { process.kill(-p.pid,"SIGKILL") } catch {}

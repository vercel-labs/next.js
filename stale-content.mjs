import { spawn } from "node:child_process"
import fs from "node:fs"
const ROOT = process.cwd(), PORT=3203
const LOG = `${process.cwd()}/stale-content.log`
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
const get=async p=>{try{const r=await fetch(`http://localhost:${PORT}${p}`);return `${r.status} ${await r.text()}`.slice(0,80)}catch(e){return "ERR"}}
fs.rmSync(`${ROOT}/.next`,{recursive:true,force:true})
const fd=fs.openSync(LOG,"w")
const p=spawn("npx",["next","dev","-p",String(PORT)],{cwd:ROOT,stdio:["ignore",fd,fd],detached:true})
for(let i=0;i<120;i++){await sleep(500);if(/Ready in/.test(fs.readFileSync(LOG,"utf8")))break}
const F=`${ROOT}/app/api/a/[id]/detail/route.ts`
console.log("v0:", await get("/api/a/x/detail"))
const st=fs.statSync(F)
fs.writeFileSync(F, `export async function GET() { return Response.json({ level: "AAAAAA" }) }\n`)
fs.utimesSync(F, st.atime, st.mtime) // restore original (older) mtime, same size
await sleep(4000)
console.log("after backdated edit (same size, old mtime):", await get("/api/a/x/detail"))
const now=new Date(); fs.utimesSync(F, now, now); await sleep(4000)
console.log("after touch:", await get("/api/a/x/detail"))
try{process.kill(-p.pid,"SIGKILL")}catch{}

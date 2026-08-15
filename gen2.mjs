// Dense strongly-connected dynamic-import digraph between "feature" modules.
// page (client) dynamically imports only ENTRY features; every feature
// dynamically imports OUT other features (deterministic pseudo-random),
// so the async chunk-group graph is strongly connected with many parents per
// group -> availability info must be intersected instead of duplicated.
//
// node gen2.mjs <out> <features> <out-edges> <payload-lines> <entries>
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2] || 'g2';
const F = Number(process.argv[3] || 64);
const OUT = Number(process.argv[4] || 4);
const PAY = Number(process.argv[5] || 400); // ~120 bytes per line
const ENTRIES = Number(process.argv[6] || 2);

let seed = 12345;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed / 2147483648);
const pay = (n) => {
  const cs = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let o = '';
  for (let i = 0; i < n; i++) {
    let s = '';
    for (let j = 0; j < 120; j++) s += cs[Math.floor(rnd() * cs.length)];
    o += `    '${s}',\n`;
  }
  return o;
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'app'), { recursive: true });
fs.mkdirSync(path.join(out, 'mods'), { recursive: true });
fs.writeFileSync(
  path.join(out, 'package.json'),
  JSON.stringify({ name: 'turbopack-async-chunk-ring', private: true, scripts: { build: 'next build' }, dependencies: { next: '16.3.1', react: '19.2.8', 'react-dom': '19.2.8' } }, null, 2)
);
fs.writeFileSync(path.join(out, 'next.config.js'), 'module.exports = {};\n');
fs.writeFileSync(path.join(out, 'app', 'layout.js'), 'export default function L({children}){return (<html><body>{children}</body></html>);}\n');

for (let i = 0; i < F; i++) {
  const targets = new Set();
  targets.add((i + 1) % F);
  while (targets.size < OUT) targets.add(Math.floor(rnd() * F));
  let src = `export async function run_${i}(k) {\n  const d = [\n${pay(PAY)}  ];\n  let t = d[(k | 0) % d.length].length;\n`;
  let n = 0;
  for (const tg of targets) {
    src += `  if (k === ${n}) { const m = await import('./f${tg}'); t += await m.run_${tg}(k + ${1 + (n % 3)}); }\n`;
    n++;
  }
  src += `  return t;\n}\n`;
  fs.writeFileSync(path.join(out, 'mods', `f${i}.js`), src);
}

let page = `'use client';\nimport { useState } from 'react';\nconst reg = {\n`;
for (let e = 0; e < ENTRIES; e++) page += `  f${e}: () => import('../mods/f${e}'),\n`;
page += `};\nexport default function Page(){\n  const [k,setK]=useState(0);const [r,setR]=useState('');\n  return (<main><input value={k} onChange={e=>setK(Number(e.target.value))}/><button onClick={async()=>{const ks=Object.keys(reg);const m=await reg[ks[k%ks.length]]();setR(String(await m[Object.keys(m)[0]](k)));}}>go</button><pre>{r}</pre></main>);\n}\n`;
fs.writeFileSync(path.join(out, 'app', 'page.js'), page);
console.log(`generated ${out}: features=${F} out=${OUT} payload=${PAY} entries=${ENTRIES}`);

#!/usr/bin/env node
// Drives the route with N DISTINCT slugs and reports how many renders succeeded before the
// server died. Node 18+. No dependencies.
//
//   node load.mjs                       # 6000 distinct slugs (default)
//   REPEAT=1 node load.mjs              # 8 slugs, repeated — the control
//
// Counts `ok`, not `sent`: once the server OOMs every remaining request fails instantly, so a
// naive count would overstate renders by ~7x.

const BASE = process.env.BASE || 'http://localhost:3000';
const TOTAL = Number(process.env.TOTAL || 6000);
const CONC = Number(process.env.CONC || 8);
const REPEAT = process.env.REPEAT === '1';

const slug = (i) => (REPEAT ? `repeated-${i % 8}` : `distinct-${i}`);

let sent = 0;
let ok = 0;
let err = 0;
const t0 = Date.now();

async function worker() {
  while (sent < TOTAL) {
    const i = sent++;
    try {
      const res = await fetch(`${BASE}/p/${slug(i)}`);
      await res.arrayBuffer();
      if (res.ok) ok++;
      else err++;
    } catch {
      err++;
    }
  }
}

const report = setInterval(() => {
  const el = (Date.now() - t0) / 1000;
  console.log(`t=${el.toFixed(0)}s ok=${ok} err=${err} rps=${(ok / el).toFixed(1)}`);
}, 5000);

await Promise.all(Array.from({ length: CONC }, worker));
clearInterval(report);

const el = (Date.now() - t0) / 1000;
console.log(`\nDONE mode=${REPEAT ? 'REPEATED slugs' : 'DISTINCT slugs'} ok=${ok} err=${err} in ${el.toFixed(0)}s`);
console.log(ok === TOTAL ? '=> SURVIVED all renders' : `=> SERVER DIED after ${ok} successful renders`);

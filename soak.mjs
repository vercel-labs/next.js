// Usage: node soak.mjs <baseUrl> <totalRequests> <concurrency>
// Drives load against the (standalone) production server started with
//   NODE_OPTIONS="--require ./instrument2.js --expose-gc" node .next/standalone/server.js
// Then `kill -USR2 <server pid>` prints the retention report.
const base = process.argv[2] || 'http://localhost:3004';
const total = Number(process.argv[3] || 600);
const conc = Number(process.argv[4] || 16);
let i = 0, done = 0;
async function worker() {
  while (i < total) {
    const n = i++;
    try { const r = await fetch(`${base}/jobs/L${n}`); await r.arrayBuffer(); } catch {}
    done++;
  }
}
await Promise.all(Array.from({ length: conc }, worker));
console.log('requests completed:', done);

// simple load generator: node load.js <url> <count>
const url = process.argv[2], total = +process.argv[3] || 2000, conc = 20;
let done = 0, next = 0, fail = 0;
async function worker() {
  while (next < total) { next++; try { const r = await fetch(url); await r.arrayBuffer(); } catch { fail++; } done++; }
}
Promise.all(Array.from({ length: conc }, worker)).then(() => console.log('done', done, 'fail', fail));

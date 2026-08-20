const url = process.argv[2];
const total = Number(process.argv[3] || 500);
const conc = Number(process.argv[4] || 20);
let done = 0;
const t0 = performance.now();
async function worker() {
  while (done < total) {
    done++;
    const r = await fetch(url, { redirect: 'manual' });
    await r.arrayBuffer();
  }
}
await Promise.all(Array.from({ length: conc }, worker));
const dt = (performance.now() - t0) / 1000;
console.log(JSON.stringify({ url, total, conc, seconds: +dt.toFixed(2), rps: +(total / dt).toFixed(1) }));

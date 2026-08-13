// usage: node measure.mjs <route> <N> [mode]
// modes: get (default) | rsc | prefetch | abort | concurrent | distinct
const route = process.argv[2] || '/client-heavy';
const N = Number(process.argv[3] || 300);
const mode = process.argv[4] || 'get';
const base = 'http://127.0.0.1:' + (process.env.APP_PORT || 3000);
const probe = 'http://127.0.0.1:' + (process.env.PROBE_PORT || 3999);
const heap = async () => (await (await fetch(probe + '/')).json()).heapUsed;

async function one(i) {
  const url = base + route + (mode === 'distinct' ? '?i=' + i : '');
  const headers = { 'user-agent': 'probe/' + i };
  if (mode === 'rsc') headers.RSC = '1';
  if (mode === 'prefetch') { headers.RSC = '1'; headers['Next-Router-Prefetch'] = '1'; }
  if (mode === 'abort') {
    const ac = new AbortController();
    try {
      const r = await fetch(url, { headers, signal: ac.signal });
      await r.body.getReader().read();
      ac.abort();
    } catch {}
    return;
  }
  const r = await fetch(url, { headers });
  await r.arrayBuffer();
}
async function run(n, off = 0) {
  if (mode === 'concurrent') {
    for (let i = 0; i < n; i += 10) await Promise.all(Array.from({ length: 10 }, (_, k) => one(off + i + k)));
  } else for (let i = 0; i < n; i++) await one(off + i);
}
const mb = (x) => +(x / 1048576).toFixed(3);
await run(20);
const before = await heap();
await run(N, 1000);
await new Promise((r) => setTimeout(r, 500));
const after = await heap();
console.log(JSON.stringify({ route, mode, N, beforeMB: mb(before), afterMB: mb(after), growthMB: mb(after - before), mbPerReq: +((after - before) / 1048576 / N).toFixed(4) }));

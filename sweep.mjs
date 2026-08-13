const base = 'http://127.0.0.1:' + (process.env.APP_PORT || 3000);
const probe = 'http://127.0.0.1:' + (process.env.PROBE_PORT || 3999);
const heap = async () => (await (await fetch(probe + '/')).json()).heapUsed;
const routes = ['/', '/client-heavy', '/streamed', '/kitchen', '/server-only'];
const head = await fetch(base + '/client-heavy');
await head.arrayBuffer();
console.log('CSP header:', head.headers.get('content-security-policy'));
const mb = (x) => +(x / 1048576).toFixed(3);
for (const route of routes) {
  for (let i = 0; i < 20; i++) await (await fetch(base + route, { headers: { 'user-agent': 'w' + i } })).arrayBuffer();
  const b = await heap();
  const N = 300;
  for (let i = 0; i < N; i++) await (await fetch(base + route, { headers: { 'user-agent': 'p' + i } })).arrayBuffer();
  const a = await heap();
  console.log(JSON.stringify({ route, N, beforeMB: mb(b), afterMB: mb(a), growthMB: mb(a - b), mbPerReq: +((a - b) / 1048576 / N).toFixed(4) }));
}

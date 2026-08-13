const route = process.argv[2] || '/client-heavy';
const chunks = Number(process.argv[3] || 10), per = Number(process.argv[4] || 500);
const conc = Number(process.argv[5] || 1);
const base = 'http://127.0.0.1:' + (process.env.APP_PORT || 3000);
const probe = 'http://127.0.0.1:' + (process.env.PROBE_PORT || 3999);
const heap = async () => (await (await fetch(probe + '/')).json()).heapUsed;
const mb = (x) => +(x / 1048576).toFixed(2);
const one = async (i) => { const r = await fetch(base + route, { headers: { 'user-agent': 'p' + i } }); await r.arrayBuffer(); };
let total = 0;
for (let i = 0; i < 20; i++) await one(i);
console.log('start', mb(await heap()));
for (let c = 0; c < chunks; c++) {
  for (let i = 0; i < per; i += conc) await Promise.all(Array.from({ length: conc }, (_, k) => one(total + i + k)));
  total += per;
  console.log('after', total, 'requests heapUsed MB =', mb(await heap()));
}

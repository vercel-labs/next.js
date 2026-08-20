// Stress the reported race: read cache -> POST route handler calling revalidateTag
// -> read cache again immediately (no delay), N times.
const base = process.env.BASE || 'http://localhost:3000';
const N = Number(process.argv[2] || 30);
const read = async () =>
  (await (await fetch(base + '/api/rated/42', { cache: 'no-store' })).json()).value;
let stale = 0;
for (let i = 1; i <= N; i++) {
  const before = await read();
  await fetch(base + '/api/rate/42', { method: 'POST', cache: 'no-store' });
  const after = await read();
  if (after === before) stale++;
  console.log(`iter ${i}: before=${before} after=${after} revalidated=${after !== before}`);
}
console.log(`stale (not revalidated on the very next request): ${stale}/${N}`);

// usage: node measure.mjs <port>
const port = process.argv[2];
const routes = ['/', '/p0','/p1','/p2','/p3','/p4','/p5'];
for (const r of routes) {
  const t = Date.now();
  const res = await fetch(`http://localhost:${port}${r}`);
  await res.text();
  console.log(`${r} status=${res.status} ${Date.now() - t}ms`);
}

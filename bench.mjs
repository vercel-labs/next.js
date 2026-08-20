const url = process.argv[2] || 'http://localhost:3000/';
const n = Number(process.argv[3] || 60);
const times = [];
for (let i = 0; i < n; i++) {
  const t = performance.now();
  const res = await fetch(url, { redirect: 'manual' });
  await res.arrayBuffer();
  times.push(performance.now() - t);
}
times.sort((a, b) => a - b);
const avg = times.reduce((a, b) => a + b, 0) / times.length;
const warm = times.slice(0, Math.floor(times.length * 0.9));
console.log(
  JSON.stringify({
    url,
    n,
    avg: +avg.toFixed(2),
    p50: +times[Math.floor(n * 0.5)].toFixed(2),
    p90: +times[Math.floor(n * 0.9)].toFixed(2),
    min: +times[0].toFixed(2),
    max: +times[n - 1].toFixed(2),
  })
);

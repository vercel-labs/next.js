const port = process.argv[2];
const n = Number(process.argv[3] || 10);
const delay = Number(process.argv[4] || 300);
for (let i = 0; i < n; i++) {
  const c = new AbortController();
  const p = fetch(`http://localhost:${port}/?i=${i}`, { signal: c.signal }).then(r => r.text()).catch(e => 'aborted');
  setTimeout(() => c.abort(), delay);
  await p;
  await new Promise(r => setTimeout(r, 100));
}
console.log('done');

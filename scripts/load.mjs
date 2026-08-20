// usage: node scripts/load.mjs <baseUrl> <path> <requestsPerRound> <rounds> <concurrency>
const [base, path, per = 500, rounds = 6, conc = 10] = process.argv.slice(2)
const mem = async () => (await fetch(`${base}/api/mem`)).json()
const hit = async (n) => {
  let done = 0
  const w = async () => { while (done < n) { done++; const r = await fetch(base + path); await r.arrayBuffer() } }
  await Promise.all(Array.from({ length: Number(conc) }, w))
}
console.log('baseline', JSON.stringify(await mem()))
for (let r = 1; r <= Number(rounds); r++) {
  const t = Date.now()
  await hit(Number(per))
  console.log(`round ${r} (${(r * per)} reqs to ${path}, ${((Date.now() - t) / 1000).toFixed(1)}s)`, JSON.stringify(await mem()))
}

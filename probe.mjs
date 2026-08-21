// Poll the route every second for 20s and print latency + which upstream
// value was served. revalidate is 5s, upstream takes 1s.
const url = process.argv[2] ?? 'http://127.0.0.1:3000/api/data'
for (let i = 0; i < 20; i++) {
  const t = Date.now()
  const r = await fetch(url, { cache: 'no-store' })
  const body = await r.json()
  console.log(
    `t=${String(i).padStart(2)}s  clientMs=${String(Date.now() - t).padStart(4)}  upstreamValue=${body.value}  routeFetchMs=${String(body.fetchMs).padStart(4)}  at=${body.at}`
  )
  await new Promise((r) => setTimeout(r, 1000 - ((Date.now() - t) % 1000)))
}

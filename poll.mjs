const url = process.argv[2] || 'http://localhost:3000/cached/5s'
const secs = Number(process.argv[3] || 40)
const start = Date.now()
while (Date.now() - start < secs * 1000) {
  const res = await fetch(url, { cache: 'no-store' })
  const html = await res.text()
  const ts = Number((html.match(/id="ts">(\d+)/) || [])[1])
  const now = Date.now()
  console.log(
    `t=+${((now - start) / 1000).toFixed(1)}s cache=${res.headers.get('x-nextjs-cache')} renderedTs=${ts} staleness=${((now - ts) / 1000).toFixed(1)}s`
  )
  await new Promise((r) => setTimeout(r, 1000))
}

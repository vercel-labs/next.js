const base = 'http://localhost:' + (process.env.PORT || 3001)
const urls = ['/x/a/b/c', '/api/stream', '/action', '/page-rw/z', '/hello']
const conc = Number(process.env.CONC || 30)
const total = Number(process.env.TOTAL || 600)
let done = 0
async function worker(i) {
  while (done < total) {
    done++
    const u = urls[done % urls.length]
    try {
      const r = await fetch(base + u)
      await r.arrayBuffer()
    } catch {}
  }
}
await Promise.all(Array.from({ length: conc }, (_, i) => worker(i)))
console.log('load done', done)

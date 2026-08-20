
const base = 'http://127.0.0.1:3000'
const t0 = Date.now()
const el = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(6)
const ISO = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.]+Z/g
function grab(h, label) {
  const i = h.indexOf(label)
  if (i < 0) return '?'
  ISO.lastIndex = i
  const m = ISO.exec(h)
  return m ? m[0] : '?'
}
async function hit() {
  const r = await fetch(base + '/cache/x', { cache: 'no-store' })
  const h = await r.text()
  return { c: r.headers.get('x-nextjs-cache') || '-', a: grab(h, 'A(rev60)'), b: grab(h, 'B(rev20)') }
}
const revAt = Number(process.argv[2] || 15), total = Number(process.argv[3] || 90)
let done = false
while ((Date.now() - t0) / 1000 < total) {
  const s = (Date.now() - t0) / 1000
  if (!done && revAt >= 0 && s >= revAt) { done = true; const j = await (await fetch(base + '/api/revalidate?tag=A')).json(); console.log(el(), '*** revalidateTag("A")', JSON.stringify(j)) }
  const { c, a, b } = await hit()
  console.log(el(), c.padEnd(6), 'A=', a, 'B=', b)
  await new Promise(r => setTimeout(r, 2000))
}

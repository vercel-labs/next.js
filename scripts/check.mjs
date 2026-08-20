// Fetches a page from the running server, downloads every <script src>, and
// reports which client component markers are present in the loaded JS.
const base = process.env.BASE || 'http://localhost:3000'
const url = process.argv[2] || '/about'
const html = await (await fetch(base + url)).text()
const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1])
let total = 0
const hits = { UNIQUE_MARKER_CAROUSEL: [], UNIQUE_MARKER_ACCORDION: [] }
for (const src of srcs) {
  const res = await fetch(base + src)
  const body = await res.text()
  total += body.length
  for (const k of Object.keys(hits)) if (body.includes(k)) hits[k].push(src)
}
console.log(`page ${url}: ${srcs.length} scripts, ${total} bytes of JS`)
for (const [k, v] of Object.entries(hits)) {
  console.log(`  ${k}: ${v.length ? 'PRESENT in ' + v.join(', ') : 'absent'}`)
}

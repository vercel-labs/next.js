// Measures how much of a page's inline RSC (flight) payload is a byte-duplicate
// of an earlier row. Rows re-emitted by the resume/prefetch stream carry a
// `<id>:o<hex>,` prefix, which is stripped before comparing.
const target = process.argv[2] ?? 'http://localhost:3000/dynamic'
const html = await (await fetch(target)).text()
const raws = [...html.matchAll(/self\.__next_f\.push\(\[(\d+),("(?:[^"\\]|\\.)*")\]\)/g)]
  .filter((m) => m[1] === '1')
  .map((m) => JSON.parse(m[2]))
const payload = raws.join('')
const rows = payload.split('\n')
const strip = (s) => s.replace(/^[0-9a-f]+:o[0-9a-f]+,/, '')
const seen = new Map()
let dupBytes = 0
let dupRows = 0
for (const row of rows) {
  const body = strip(row).replace(/^[0-9a-f]+:/, '')
  if (body.length < 40) continue
  if (seen.has(body)) {
    dupBytes += body.length
    dupRows++
  } else seen.set(body, true)
}
const oRows = rows.filter((r) => /^[0-9a-f]+:o[0-9a-f]+,/.test(r)).length
console.log(`target             ${target}`)
console.log(`page               ${html.length.toLocaleString()} chars`)
console.log(`flight payload     ${payload.length.toLocaleString()} chars in ${rows.length} rows`)
console.log(`resume "o" rows    ${oRows}`)
console.log(`byte-identical dup ${dupRows} rows / ${dupBytes.toLocaleString()} chars`)
console.log(`duplicated         ${((dupBytes / html.length) * 100).toFixed(0)}% of page HTML`)

import fs from 'fs'
const rows = fs.readFileSync(process.argv[2] ?? '/tmp/spans.jsonl', 'utf8')
  .trim().split('\n').map((l) => JSON.parse(l))
const by = new Map()
for (const r of rows) { if (!by.has(r.traceId)) by.set(r.traceId, []); by.get(r.traceId).push(r) }
for (const [traceId, spans] of by) {
  console.log(`TRACE ${traceId} (${spans.length} spans)`)
  for (const s of spans) {
    console.log(`   ${s.name} | type=${s.attributes['next.span_type']} | parent=${s.parentSpanId ?? 'NONE (root)'}`)
  }
}
console.log(`\n${by.size} trace(s) for 1 request`)

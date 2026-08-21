// Groups spans logged by instrumentation.node.js by traceId.
import { readFileSync } from 'node:fs';
const lines = readFileSync(process.argv[2] || 'spans.log', 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const traces = new Map();
for (const s of lines) {
  if (!traces.has(s.traceId)) traces.set(s.traceId, []);
  traces.get(s.traceId).push(s);
}
console.log(`traces: ${traces.size}, spans: ${lines.length}`);
for (const [id, spans] of traces) {
  console.log(`\ntrace ${id}`);
  for (const s of spans) console.log(`  ${s.name} [type=${s.span_type}] bubble=${s.bubble} parent=${s.parentSpanId}`);
}

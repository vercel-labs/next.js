const fs = require('fs')
const { NodeTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')

const logFile = process.env.SPAN_LOG || '/tmp/spans-preload.jsonl'
const exporter = {
  export(spans, cb) {
    for (const s of spans) {
      fs.appendFileSync(logFile, JSON.stringify({
        pid: process.pid,
        name: s.name,
        traceId: s.spanContext().traceId,
        spanId: s.spanContext().spanId,
        parentSpanId: s.parentSpanContext?.spanId ?? s.parentSpanId,
        kind: s.kind,
        attrs: s.attributes,
      }) + '\n')
    }
    cb({ code: 0 })
  },
  shutdown() { return Promise.resolve() },
}
const provider = new NodeTracerProvider({ spanProcessors: [new SimpleSpanProcessor(exporter)] })
provider.register()
registerInstrumentations({ instrumentations: [new HttpInstrumentation()] })
console.log('[otel-preload] pid', process.pid)

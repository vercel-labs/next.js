export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const fs = require('fs')
  const { NodeTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node')
  const { registerInstrumentations } = require('@opentelemetry/instrumentation')
  const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')

  const logFile = process.env.SPAN_LOG || '/tmp/spans.jsonl'
  const exporter = {
    export(spans, cb) {
      for (const s of spans) {
        fs.appendFileSync(logFile, JSON.stringify({
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
  if (process.env.ENABLE_HTTP_INSTRUMENTATION === '1') {
    registerInstrumentations({ instrumentations: [new HttpInstrumentation()] })
  }
  console.log('[otel] registered, http instrumentation:', process.env.ENABLE_HTTP_INSTRUMENTATION === '1')
}

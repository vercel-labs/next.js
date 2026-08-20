import { registerOTel, OTLPHttpJsonTraceExporter } from '@vercel/otel'

export function register() {
  registerOTel({
    serviceName: 'repro-67737',
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: 'http://127.0.0.1:4318/v1/traces',
    }),
  })
}

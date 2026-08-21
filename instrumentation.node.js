import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { appendFileSync } from 'node:fs';

const LOG = process.env.OTEL_LOG_FILE || 'spans.log';

class FileSpanProcessor {
  onStart() {}
  onEnd(span) {
    appendFileSync(
      LOG,
      JSON.stringify({
        traceId: span.spanContext().traceId,
        spanId: span.spanContext().spanId,
        parentSpanId: span.parentSpanId ?? span.parentSpanContext?.spanId ?? null,
        name: span.name,
        span_type: span.attributes['next.span_type'] ?? null,
        bubble: span.attributes['next.bubble'] ?? null,
      }) + '\n'
    );
  }
  async forceFlush() {}
  async shutdown() {}
}

const provider = new NodeTracerProvider({
  spanProcessors: [new FileSpanProcessor()],
});
provider.register();

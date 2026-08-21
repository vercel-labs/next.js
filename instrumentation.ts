import { NodeSDK, tracing } from "@opentelemetry/sdk-node";
import fs from "fs";

// Writes one JSON line per finished span so we can inspect traceId/parentSpanId
// without needing a collector (jaeger/docker).
class FileExporter implements tracing.SpanExporter {
  export(spans: any[], cb: (r: any) => void) {
    for (const s of spans) {
      fs.appendFileSync(
        process.env.OTEL_SPAN_LOG || "/tmp/spans.jsonl",
        JSON.stringify({
          name: s.name,
          traceId: s.spanContext().traceId,
          spanId: s.spanContext().spanId,
          parentSpanId: s.parentSpanContext?.spanId ?? s.parentSpanId ?? null,
          attributes: s.attributes,
        }) + "\n"
      );
    }
    cb({ code: 0 });
  }
  shutdown() { return Promise.resolve(); }
  forceFlush() { return Promise.resolve(); }
}

export const register = async () => {
  new NodeSDK({
    spanProcessors: [new tracing.SimpleSpanProcessor(new FileExporter())],
  }).start();
};

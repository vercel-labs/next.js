// The same OTel setup, but loaded via `node --require ./otel-preload.cjs`
// (the canonical OTel pattern) instead of instrumentation.ts.
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const sdk = new NodeSDK({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: 'next-app' }),
    spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
    instrumentations: [
        new HttpInstrumentation({
            responseHook: (span, response) => {
                if ('setHeader' in response && !response.headersSent) {
                    response.setHeader('x-otel-trace-id', span.spanContext().traceId);
                }
            },
        }),
    ],
});
sdk.start();
console.error('[repro] OTel NodeSDK started via --require preload');

// Manual OpenTelemetry configuration, as recommended by the Next.js guide:
// https://nextjs.org/docs/app/guides/open-telemetry#manual-opentelemetry-configuration
// plus @opentelemetry/instrumentation-http to get incoming HTTP server spans.
import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'next-app',
    }),
    spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
    instrumentations: [
        new HttpInstrumentation({
            // Marker to observe from the outside whether the instrumentation
            // actually handles incoming requests.
            responseHook: (span, response) => {
                if ('setHeader' in response && !response.headersSent) {
                    response.setHeader('x-otel-trace-id', span.spanContext().traceId);
                }
            },
        }),
    ],
});

sdk.start();
console.error('[repro] OTel NodeSDK started (NEXT_RUNTIME=nodejs)');

import { start } from '@splunk/otel';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';

start({
  tracing: {
    instrumentations: [new UndiciInstrumentation()],
  },
  endpoint: `http://${process.env.K8S_NODE_IP || 'localhost'}:4317`,
  profiling: {
    memoryProfilingEnabled: true,
  },
  serviceName: 'test',
  logLevel: 'error',
  metrics: true,
});

export default {}

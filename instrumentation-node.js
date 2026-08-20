const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node')

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

const sdk = new NodeSDK({
  spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
  instrumentations: [
    new HttpInstrumentation({
      requestHook: () => console.log('[repro] HttpInstrumentation requestHook FIRED'),
      responseHook: () => console.log('[repro] HttpInstrumentation responseHook FIRED'),
    }),
  ],
})
sdk.start()
console.log('[repro] OTel NodeSDK started')

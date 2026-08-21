// Control experiment: same SDK config, but loaded via `node --import` BEFORE Next boots.
import * as fs from 'fs'
import * as opentelemetry from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import {
  PeriodicExportingMetricReader,
  AggregationTemporality,
} from '@opentelemetry/sdk-metrics'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const LOG = process.env.OTEL_METRICS_LOG || '/tmp/otel-metrics-preload.log'
const fileExporter = {
  export(metrics, cb) {
    const names = []
    for (const sm of metrics.scopeMetrics)
      for (const m of sm.metrics)
        names.push(`${sm.scope.name} :: ${m.descriptor.name}`)
    if (names.length) fs.appendFileSync(LOG, names.sort().join('\n') + '\n')
    cb({ code: 0 })
  },
  async forceFlush() {},
  async shutdown() {},
  selectAggregationTemporality: () => AggregationTemporality.CUMULATIVE,
}
const sdk = new opentelemetry.NodeSDK({
  resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: 'next-app' }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: fileExporter,
    exportIntervalMillis: 2000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})
sdk.start()

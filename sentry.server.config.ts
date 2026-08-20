import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://public@o0.ingest.sentry.io/0',
  tracesSampleRate: 1,
  debug: false,
})

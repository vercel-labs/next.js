import * as Sentry from '@sentry/nextjs'

export async function register() {
  Sentry.init({ dsn: '', tracesSampleRate: 1 })
  console.log('instrumentation registered')
}

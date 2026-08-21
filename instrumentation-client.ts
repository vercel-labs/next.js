import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://public@o0.ingest.sentry.io/0",
  tracesSampleRate: 0,
  beforeSend(event) {
    (window as unknown as { __sentryEvent?: unknown }).__sentryEvent = event;
    return null;
  },
});

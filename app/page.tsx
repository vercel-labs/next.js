"use client";

import * as Sentry from "@sentry/nextjs";

export default function Page() {
  return (
    <button
      id="boom"
      onClick={() => {
        try {
          throw new Error("SentryExampleFrontendError");
        } catch (err) {
          (window as unknown as { __stack?: string }).__stack = (err as Error).stack;
          Sentry.captureException(err);
        }
      }}
    >
      Throw error
    </button>
  );
}

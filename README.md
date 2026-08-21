# Repro: vercel/next.js#78457

Instrumentation load errors whose `message` is a getter-only property are replaced by
`TypeError: Cannot set property message of Error which has only a getter`, hiding the
real error (e.g. a ZodError thrown while parsing env vars).

Cause: `packages/next/src/server/dev/next-dev-server.ts` does
`err.message = "An error occurred while loading instrumentation hook: " + err.message`.

## Run

    npm install
    npm run dev

Expected: the real error (`REAL ERROR: invalid environment variable FOO`) is surfaced.
Actual: `TypeError: Cannot set property message of Error which has only a getter`.

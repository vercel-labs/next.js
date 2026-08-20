# Reproduction for vercel/next.js#54417

`next dev` masks any instrumentation-hook error whose `message` is a getter,
because `next-dev-server.ts` does `err.message = \`An error occurred while loading instrumentation hook: ${err.message}\``.

## Run

```bash
npm install
npm run dev
# then, in another shell:
curl http://localhost:3000/
```

## Observed (next@16.3.1-canary.25)

The dev server prints, instead of the real error, and exits:

```
TypeError: Cannot set property message of Error which has only a getter
    at ignore-listed frames
```

If the thrown value is not an `Error` at all (e.g. `class C { get message() {} }`),
the assignment silently fails in sloppy mode and the instrumentation error is
swallowed completely: the request returns 200 and nothing is logged.

## Expected

The original instrumentation error (`validation failed`) should be reported, e.g. by
wrapping it with `cause` — which `next start` already does correctly.

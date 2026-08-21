# Repro: vercel/next.js#81050 — instrumentation hook not run in `output: 'standalone'`

Root-level `instrumentation.ts` (project also has a `src/` folder) is compiled by
`next build` into `.next/server/instrumentation.js`, but it is **not copied into
`.next/standalone`**, so the hook never runs when the standalone server boots.
`next start` on the same build does run it.

## Steps

```bash
npm install
npx next build

ls .next/server/instrumentation.js            # exists  -> hook was compiled
ls .next/standalone/.next/server/             # instrumentation.js is MISSING

node .next/standalone/server.js               # no "instrumentation ROOT" logged
npx next start                                # logs "instrumentation ROOT"
```

Move the file to `src/instrumentation.ts`, rebuild, and
`.next/standalone/.next/server/instrumentation.js` is present and the hook logs.

Pinned to `next@16.3.1-canary.26`. On `next@15.3.4` the same project shape fails
even earlier: a root `instrumentation.ts` next to a `src/` folder is not compiled
by `next build` at all, while `next dev --turbopack` does run it.

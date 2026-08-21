# Repro: instrumentation.ts is analyzed for the Edge Runtime in `next dev`

Upstream issue: https://github.com/vercel/next.js/issues/86479

## Steps

```bash
npm install
npm run dev
# open http://localhost:3000 in a browser (the warning is emitted after the
# first page load / HMR connection, not at startup)
```

## Observed

The terminal prints, even though there is no edge middleware/proxy and no
`runtime = 'edge'` route, and `register()` only ever runs with
`NEXT_RUNTIME=nodejs`:

```
⚠ ./instrumentation.ts:3:3
Warning: A Node.js API is used (process.on at line: 3) which is not supported in the Edge Runtime.
Ecmascript file had an error
```

## Expected

No Edge Runtime diagnostic for `instrumentation.ts` when the app has no edge
runtime consumer.

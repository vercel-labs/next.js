# Repro: SWC/Turbopack minifier mangles server function names (breaks Temporal workflow resolution)

Issue: https://github.com/vercel/next.js/issues/74332

Temporal resolves workflows by `fn.name`. Next.js server minification mangles those names.

## Run

```bash
npm install
npm run build && npm start
curl localhost:3000/api/name
```

Observed (next 16.3.1 and 15.1.3, production build):
`{"importedFunctionName":"t","importedArrowName":"r","localFunctionName":"e"}`

Expected: `myTemporalWorkflow` / `arrowWorkflow` / `localWorkflow` (what `next dev` returns).

## Notes

- `experimental.serverMinification: false` has NO effect on the default (Turbopack) build in 16.3.1.
- `next build --webpack` + `experimental.serverMinification: false` does preserve the names.

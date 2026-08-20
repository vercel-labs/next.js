# Repro: missing `Metric` type in `useReportWebVitals` (vercel/next.js#59903)

`next/dist/client/web-vitals.d.ts` declares
`import type { Metric } from 'next/dist/compiled/web-vitals'`, but
`node_modules/next/dist/compiled/web-vitals/` contains only `web-vitals.js`
(no `.d.ts`). So the callback parameter silently degrades to `any`.

## Run

```bash
npm install
npm run repro
```

## Expected vs actual

- `npm run typecheck` (skipLibCheck: true, the Next.js default): passes with **no
  errors**, even though `analytics.tsx` assigns `metric.name` to a `number` and
  reads a non-existent property — proving `metric` is `any`.
- `npm run typecheck:strict` (`--skipLibCheck false`): errors with
  `TS7016: Could not find a declaration file for module 'next/dist/compiled/web-vitals'`.

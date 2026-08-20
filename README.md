# Repro: next.js#67714 — `react-dom/server` cannot be imported from `instrumentation.ts`

Next.js 16.3.1, Node 24.

```bash
npm install
npx next build            # turbopack build fails
npx next build --webpack  # webpack build fails
npx next dev --webpack    # dev compile error, GET / => 500
npx next dev              # instrumentation runs & logs the string, but GET / => 500 with the same error
```

Expected: `instrumentation.ts` (server-only code, never part of a client bundle) may import
`react-dom/server`. Observed: the `react-dom/server` client-boundary check is applied to the
instrumentation module graph.

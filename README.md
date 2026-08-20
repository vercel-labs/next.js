# Repro: vercel/next.js#71161 — "Server Action fails silently on timeout"

`middleware.ts` intercepts the Server Action POST (`next-action` header) and answers
`504` with body `FUNCTION_INVOCATION_TIMEOUT`, which is what Vercel's infrastructure
returns when a function exceeds its max duration. The page calls the action inside
`try/catch` and prints whether the promise resolved or threw.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm run start
npm run test:browser   # clicks the button, prints the outcome + POST status
```

Or open http://localhost:3000 and click **Test Action**.

## Results

| next | outcome |
| --- | --- |
| 16.3.1 (dev, Turbopack) | `THREW: FUNCTION_INVOCATION_TIMEOUT` (fixed) |
| 15.5.23 (dev) | `THREW: FUNCTION_INVOCATION_TIMEOUT` (fixed) |
| 14.2.10 (dev and `next build && next start`) | `RESOLVED: undefined` (bug as reported) |

To see the original buggy behavior:

```bash
npm i next@14.2.10 react@18.3.1 react-dom@18.3.1
npm run dev && npm run test:browser
```

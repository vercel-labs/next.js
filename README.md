# next.js#75859 — "Server Actions must be async functions." reported for inner callbacks

Minimal repro of https://github.com/vercel/next.js/issues/75859 (mirrors
chungweileong94/nextjs-server-action-async-func-bug plus the `enum` case from the comments).

    npm install --legacy-peer-deps
    npx next build       # or: npm run dev, then open http://localhost:3000

## Result matrix (verified)

| next | `next build` |
| --- | --- |
| 15.0.3-canary.6 (reported) | FAILS — 2x `Server Actions must be async functions.` at `.middleware(() => ...)` and `.refine((v) => true)` |
| 15.1.0 / 15.2.0 / 15.3.0 / 15.5.4 | FAILS — 3 errors (also flags the compiled TS `enum` IIFE) |
| 16.0.0 | FAILS — 2 errors |
| 16.1.0 / 16.2.0 / 16.3.0 / 16.3.1-canary.26 | PASSES |

The check still fires correctly for a genuinely non-async exported action, e.g.
`export function notAsync() {}` in a `"use server"` file, so the transform now only
validates exported top-level functions instead of every nested arrow function.

Note: the original repro's `page.tsx` used `action.bind({ name })`, which logs the
unrelated runtime message `Cannot bind "this" of a Server Action.`

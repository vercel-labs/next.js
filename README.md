# Repro: vercel/next.js#82723

Turbopack production build crashes with `ReferenceError: Cannot access 'ZodEnum' before initialization`
(scope hoisting breaks zod v4's circular imports).

```
npm install
npm run build          # next build --turbo  -> fails
npm run build:webpack  # next build (webpack) -> succeeds
```

Verified: fails on next 15.4.6 and 15.5.7 (zod 4.0.2), passes with
`experimental.turbopackScopeHoisting: false`, and passes on next 16.1.6 / 16.3.1-canary.26.

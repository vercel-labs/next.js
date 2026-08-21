# Reproduction: vercel/next.js#87505

Extra (non-route) named exports in a Route Handler fail the webpack build's type check.

## Steps

```bash
npm install
npx next build --webpack   # ❌ Type error: "SOMETHING" is not a valid Route export field.
npx next build             # ✅ Turbopack build succeeds
```

`app/api/route.ts` exports `GET` plus an extra `SOMETHING` const.

Observed on next@16.1.0 and next@16.3.1-canary.26 (webpack). Turbopack builds pass, so the
behavior is inconsistent between bundlers.

# Repro: vercel/next.js#66604 — can't use a value exported from a "use client" module inside a Server Component

Repaired/updated version of https://github.com/eric-burel/client-array-next-repro
(original lockfile no longer installs: react peer conflict with next@15.0.0-canary.14).

## Run

```bash
npm install
npm run dev   # open http://localhost:3000  -> 500
# or
npm run build # prerender of "/" fails
```

## Observed on next@16.3.1-canary.25 (Turbopack dev and `--webpack` build)

```
TypeError: {imported module ./app/client-array.tsx}.i18nTokens.includes is not a function
    at app/page.tsx:6:79
```

A plain array (`export const i18nTokens = ["foobar"]`) exported from a `"use client"`
module becomes a client reference proxy on the server, so any method call on it throws.
The original friendly message ("Attempted to call includes() from the server but
includes is on the client...") is now an opaque `is not a function` TypeError.

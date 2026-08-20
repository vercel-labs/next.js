# Repro for vercel/next.js#45348 — app dir page calling `cookies()` marked static

Original reporter repo: https://github.com/peterjuras/nextjs-13-wrong-static-rendering
Repaired for modern Next.js (async `cookies()`, `experimental.appDir` removed).

## Run
```
npm install
npm run build
```

## Result on next@16.3.1-canary.25
`/[slug]` is reported as `ƒ (Dynamic)`, i.e. the original issue no longer reproduces.

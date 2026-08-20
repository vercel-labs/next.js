# Repro: vercel/next.js#72904

Third-party code (e.g. `@sentry/core`'s `uuid4()`) calling `crypto.randomUUID()` in a
Server Component errors under Cache Components (`experimental.cacheComponents`, formerly `dynamicIO`).
`lib/third-party-sdk.ts` mimics Sentry's `uuid4()`.

```
npm install
npm run dev   # then open http://localhost:3000 -> error overlay / server log
npm run build # fails prerendering "/"
```

Verified with next@16.3.1, react@19.2.0, Node 24.

# Repro: `use cache` closures — module-scope vs. locally-scoped non-serializable values (#74498)

Docs claim non-serializable closed-over values become "opaque references". In practice:

- `app/page.tsx` CASE A: cached fn closes over `db` imported from module scope -> works, methods callable.
- CASE B: same class instance closed over from a local (dependency-injected) scope -> throws
  `Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.`

## Run

```
npm install
npm run dev   # open http://localhost:3010 (or default 3000)
```

Observed with next@16.3.1-canary.25, react 19.2.8, `cacheComponents: true`.

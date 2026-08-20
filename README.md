# Repro: null-prototype object passed from Server Component to Client Component (next#47447)

```
npm install && npm run dev   # visit http://localhost:3010 -> 500
npm run build                # build fails
```

Observed on next@16.3.1-canary.25 / react 19.2.0:

```
Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
  <... myObject={{foo: "bar"}}>
```

Originally reported as a warning (Next 13.2); it is now a hard error that also fails `next build`.

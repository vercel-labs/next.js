# Reproduction: issue #52700 — usePathname() causes hydration errors when combined with rewrites

Repaired/updated version of https://github.com/codeurs/next-rewrites-usepathname-hydration-error
running on `next@canary` (verified with 16.3.1-canary.25, React 19).

`next.config.js` rewrites `/bug` -> `/error`. A client component calls `usePathname()`.

## Run

```bash
npm install
npm run build   # only /error is prerendered; build logs { pathname: '/error' }
npm start
# open http://localhost:3000/bug in a browser
```

## Observed

- Server HTML for `/bug` contains `The current pathname is: /error` (the prerendered `/error` output).
- On the client `usePathname()` returns `/bug`, so hydration fails:
  `Minified React error #418` (text content mismatch).
- `next dev` does NOT reproduce: the server render already uses `/bug`.

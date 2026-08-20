# Repro: #39638 — rewrites + `trailingSlash: true` force hard navigation / "Invariant: attempted to hard navigate to the same URL /"

The reporter's repo (grayaustinc/next-12.2.4-rewrite-bug) now 404s, so this is a minimal rebuild.

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

## next.config.js

`trailingSlash: true` plus rewrites whose `source` ends in a slash:

- `/` -> `/home/`
- `/test/` -> `/test/1/`  (`pages/test/[slug].js`, no `pages/test/index.js`)
- `/no-slash` -> `/test/2/` (control: source without trailing slash)

## Observed on next@16.3.1-canary.25 (also reported since 12.2.1)

1. Click "1. /test/": full page reload instead of client-side navigation.
2. Click "Home button" (`href="/"`): full page reload.
3. Click "Home button" again on `/`: uncaught
   `Invariant: attempted to hard navigate to the same URL / http://localhost:3000/`
4. Control link `/no-slash` navigates client-side with no error.

Expected: client-side navigation, no invariant error (behaviour of 12.1.4).

Root cause pointer from the thread: `resolve-rewrites.ts` appends `(/)?` to
`rewrite.source` when `__NEXT_TRAILING_SLASH` is set, which cannot match with
`path-to-regexp` `strict: true` when the source already ends in `/`.

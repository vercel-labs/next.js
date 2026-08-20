# Repro: custom `app/[lang]/not-found.js` not used for unmatched routes

Issue: https://github.com/vercel/next.js/issues/71616

## Run

```bash
npm install
npm run dev
# then:
curl -s http://localhost:3000/en/trigger      | grep -o "Custom \[lang\] not-found"   # works (notFound() called in a matched page)
curl -s http://localhost:3000/en/nonexistent  | grep -o "This page could not be found" # BUG: built-in 404 instead of app/[lang]/not-found.js
```

`/en/nonexistent` matches no route, so Next renders the built-in 404 page (or
`app/not-found.js` if present) instead of the locale-scoped
`app/[lang]/not-found.js`. Same result with `next build && next start`.

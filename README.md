# Reproduction: Link prefetch calls generateMetadata when streaming (#80583)

## Run

```bash
npm install
npm run build
npm start
# open http://localhost:3000 and watch the server terminal
```

## Observed

With 5 `<Link href="/item/N">` in the viewport, the router issues 5 prefetch
requests (`RSC: 1`, `Next-Router-Prefetch: 1`) and the server logs:

```
generateMetadata called for id=1
generateMetadata called for id=2
generateMetadata called for id=3
generateMetadata called for id=4
generateMetadata called for id=5
```

`page render for id=...` is never logged, i.e. only `loading.js` is used for the
page shell, but `generateMetadata` is still executed for every prefetched link.

Reproduces on next@15.3.3 and next@16.3.1-canary.26 (on canary each link issues
two segment prefetch requests, `generateMetadata` still runs once per link).

## Minimal manual check (no browser)

```bash
curl -s -o /dev/null -H 'RSC: 1' -H 'Next-Router-Prefetch: 1' http://localhost:3000/item/42
# server logs: generateMetadata called for id=42
```

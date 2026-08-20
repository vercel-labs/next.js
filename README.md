# Repro: `params` / `searchParams` are `undefined` in `template.js` (App Router)

Issue: https://github.com/vercel/next.js/issues/48149

## Run
```
npm install
npm run dev
# then: curl "http://localhost:3000/foo?a=1"
```

## Observed (next@16.3.1-canary.25)
Server logs:
```
[layout] params = { module: 'foo' } searchParams = undefined
[template] params = undefined searchParams = undefined
[page] params = { module: 'foo' } searchParams = { a: '1' }
```
HTML shows `params in template: null` while layout/page receive params.

Expected: `template.js` receives `params` (and `searchParams`) like `layout.js` / `page.js`.

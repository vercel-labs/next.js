# Repro: `use cache` + `cacheLife` shorter than 300s requires Suspense (#74158)

Next.js 16.3.1-canary.25, `cacheComponents: true`.

```
npm install
npx next dev   # visit /minutes (ok), /seconds (error), /expire299 (error)
npx next build # build fails on /expire299
```

`cacheLife('minutes')` prerenders fine; `cacheLife('seconds')` and
`cacheLife({ expire: 299 })` (expire < 300s) make the route be treated as
runtime/dynamic and demand a `<Suspense>` boundary.

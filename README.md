# unstable_cache does not deserialize Dates (vercel/next.js#51613)

Minimal reproduction: `unstable_cache` returns `Date` values as ISO strings on cache hits.

```
npm install
npm run dev
# request http://localhost:3000/ twice
```

First request (cache miss) renders fine. Every subsequent request (cache hit) fails with
`TypeError: post.createdAt.toISOString is not a function` because `createdAt` is a `string`.

`/use-cache` (same data via the `"use cache"` directive) keeps the value a real `Date`.

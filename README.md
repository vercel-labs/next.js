# Repro: next.js#74276

`getStaticProps` returning `notFound: true` on a dynamic route with `fallback: true`
shows the default error page (`Error: Failed to load static props`) instead of the
custom `pages/404.js`, when a pass-through `middleware.js` exists.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/products/3/hello
```

Observed: blank/error page, console `Error: Failed to load static props`.
Network: `_next/data/development/products/3/hello.json?...` -> 404 (expected, notFound),
then `_next/data/development/404.json?id=3&slug=hello` -> 404 (unexpected).

Delete `middleware.js` and the custom 404 page renders correctly.

Reproduced with next 15.1.6 and 16.3.1-canary.25.

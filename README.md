# Reproduction attempt for vercel/next.js#68053

App Router: does `router.push(href)` scroll to top like `<Link>`?

## Run
```
npm install
npm run build && npm start   # http://localhost:3000
node variants.mjs            # BASE=http://localhost:3000 (playwright)
```
`variants.mjs` scrolls to y=3000 on the start page, navigates, then prints the resulting `window.scrollY`.

## Result
Both `next@14.2.5` (the reported version, Node 20) and `next@16.3.1` scroll to top (`scrollY=0`)
for `router.push` and `<Link>` in every variant: static prefetched route, dynamic route with
`loading.tsx`, searchParams-only change, and `startTransition(() => router.push(...))`.
`experimental.scrollRestoration` (set in next.config.js) is a Pages-Router-only flag and has no
effect on the App Router.

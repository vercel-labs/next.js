# Repro: vercel/next.js#52260 — `router.push("/blog", data)` object argument is ignored (App Router)

Next.js: 16.3.1-canary.25

## Run
```
npm install
npm run dev
# open http://localhost:3000 and click "push /blog with object"
node check.mjs   # optional: Playwright assertion
```

## Observed
Navigating with `router.push("/blog", { name: "John", number: 40 })` navigates to `/blog`
but the object is silently dropped: `/blog` renders `params={}` and `searchParams={}`.
No runtime warning/error. `AppRouterInstance.push(href, options?)` only accepts
`NavigateOptions` ({ scroll, transitionTypes }), so there is no supported channel for
passing arbitrary state between routes (feature request).

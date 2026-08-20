# Repro harness — vercel/next.js#71365

"Page is not rendered if `router.push({static path with query params})`" with `output: "export"`.

The reporter's CodeSandbox devbox link in the issue is not publicly reachable (Cloudflare 403 / sign-in),
so this is a from-scratch harness that follows the reported steps and the extra conditions reported in the
issue comments (all-client-components App Router, `trailingSlash: true`, `next build --webpack`,
`router.prefetch()` of the param-less URL, initial load on a route that already has query params,
`generateStaticParams()` route, and clicking a link while its prefetch is still in flight).

## Run

```bash
npm install
npm run build          # next build --webpack, output: "export"
npm run serve          # serves ./out on http://localhost:3000 (plain static file server)
BASE=http://localhost:3000 npm test   # Playwright matrix, exits 1 if a navigation renders nothing
```

`app/` routes: `/` (buttons + Link), `/login` and `/other` (client pages reading `useSearchParams()`
inside `<Suspense>`), `/post/[id]` (`generateStaticParams`, client page).

## Result on this harness

Every scenario renders the target page. Verified with:

* next 16.2.9 (webpack), `trailingSlash: true` and flat (`trailingSlash` off) — local static server
* next 14.2.10 (the version in the issue report) — local static server
* next 16.2.9 static `out/` uploaded to a real static host (Vercel static deployment, `cleanUrls: true`)

The RSC requests that back these navigations (`/login/index.txt?firstVisit=true&_rsc=…` and, when the
segment cache is used, `/login/__next.login.__PAGE__.txt?firstVisit=true&_rsc=…`) all return 200 and the
page renders with the correct `useSearchParams()` value.

Navigating on the reporter-adjacent real app (`HerrZatacke/gb-printer-web`, GitHub Pages, prefetch disabled
via its own `window.debugNext71365` switch) also rendered `/gallery/?page=1` correctly.

So a further ingredient from the affected apps/hosts is still missing; the issue needs a runnable
reproduction (public repo + the exact static host/serve command) to move forward.

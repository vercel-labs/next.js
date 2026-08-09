# Reproduction attempt for vercel/next.js#97000

"404 body is not server-rendered when the route is dynamic (NoFallbackError, layout-less document)"

Run: `npm install && ./verify.sh` (Next 16.3.0, `next build && next start`).

## Result (Next 16.3.0 and 16.3.1-canary.9, Turbopack and webpack builds)

| variant | route symbol | `GET /unknown` | not-found markup in HTML |
| --- | --- | --- | --- |
| A: `generateStaticParams` + `dynamicParams = false` + `await searchParams` (dynamic `ƒ`) | `ƒ /[slug]` | **200** – renders `<h1>unknown {}</h1>` inside the root layout | n/a (no 404 at all) |
| B: same without `searchParams` (static `●`) | `● /known` | 404 | **yes** – `<h1>Page not found</h1>` inside the root layout |

The reported blank/layout-less 404 body did not occur. In variant A the route is not
present in `.next/prerender-manifest.json` `dynamicRoutes` at all (no `fallback: false`
entry), so the `NoFallbackError` / 404 path is never reached and `dynamicParams = false`
is silently ignored: any unmatched slug is server-rendered with status 200.

In variant B the server does log `Error: Internal: NoFallbackError`, but the 404 response
still contains the root layout and the `not-found.tsx` markup.

# Repro for vercel/next.js#54507 — searchParams empty on Vercel in a statically generated route

Original report: https://github.com/vercel/next.js/issues/54507
Original repro (Next 13.4.20-canary.4): https://github.com/andrewgolovanov/reproduction-app

## Run

```bash
npm install
npm run build && npm start
# then:
curl -s 'http://localhost:3000/blog/1?test=1'       # awaited  -> {"test":"1"}
curl -s 'http://localhost:3000/unawaited/1?test=1'  # never awaited -> {} (route stays SSG)
```

Also deployed to Vercel (`/blog/1?test=1`, `/unawaited/1?test=1`).

## Result on next@16 canary

`next build` marks `/blog/[id]` as `ƒ (Dynamic)` even though it declares
`generateStaticParams()` + `revalidate = 60`, and the awaited `searchParams`
contains the real query on Vercel and with `next start`.

Only the route that never awaits `searchParams` stays SSG (`●`) and logs an
empty object, which is expected in the Next 15+ async-params model.

## Verified on Vercel (next@16.3.1-canary.25)

| URL | x-vercel-cache | body |
| --- | --- | --- |
| `/blog/1?test=1` (awaits searchParams) | MISS (dynamic) | `{"test":"1"}` |
| `/blog/1?test=2&foo=bar` | MISS (dynamic) | `{"test":"2","foo":"bar"}` |
| `/unawaited/1?test=1` (never awaits) | PRERENDER | `{}` |

For contrast, the original repro on next@13.4.20-canary.4 builds **both** routes as
`● (SSG)`, which is why `searchParams` was silently empty there.

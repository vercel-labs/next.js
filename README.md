# Repro probe for vercel/next.js#67170 — "Headers are not set in Edge Runtime (Vercel) but does so locally"

The reporter's repository (cusxio/next-middleware-test) and deployment are both 404, so this is a
rebuilt probe on the exact reported version (next@14.2.4) covering 11 middleware header/cookie
patterns. Each route prints the value a server component / route handler observes.

| route | middleware pattern | reader |
| --- | --- | --- |
| /a | `NextResponse.next({ request: { headers } })` | `headers()` |
| /b | `request.headers.set(...)` in place + `NextResponse.next()` | `headers()` |
| /c | pattern A + `response.cookies.set()` | `headers()` |
| /d | `response.headers.set(...)` only | `headers()` |
| /e | `NextResponse.next({ headers })` (wrong form) | `headers()` |
| /f | `response.cookies.set(...)` only | `cookies()` |
| /g | `request.cookies.set(...)` + next({request:{headers}}) | `cookies()` |
| /h | non-`x-` camelCase request header override | `headers()` |
| /i | pattern A, page with `runtime = 'edge'` | `headers()` |
| /j | pattern A, edge route handler | `headers()` |
| /k | `NextResponse.rewrite(url, { request: { headers } })` | `headers()` |

## Run

    npm install
    npm run dev      # then curl http://localhost:3000/a ... /k
    npm run build && npm start

## Result (2026, next@14.2.4)

`next dev`, `next start` and a Vercel deployment agree on every route:
A, C, D, E, G, H, I, J, K show the session id; B and F are `null` (expected: in-place
`request.headers.set` and response-only cookies are not propagated to the render).
No local-vs-Vercel divergence was observed.

# Repro: next#63453 — `Headers cannot be modified` when forwarding `headers()` to `fetch()` on Vercel

Server component does a self-fetch to its own route handler while forwarding the
incoming request headers. Works locally (`next dev` and `next build && next start`),
throws on a Vercel deployment.

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000 -> all cases OK
```

Then deploy the same directory to Vercel and open `/`.

## Observed on Vercel (next@canary 16.3.1-canary.25 and next@14.1.3)

| case | init | result |
| --- | --- | --- |
| D | no init | OK |
| E | `{headers: {'x-test':'1'}}` | OK |
| A | `{headers: await headers()}` | **ERROR: Headers cannot be modified** |
| B | `{headers: new Headers(await headers())}` | **ERROR** (the workaround in the issue no longer helps) |
| C | `{headers: Object.fromEntries((await headers()).entries())}` | **ERROR** |
| F | same copy with all `x-vercel-*` removed | OK |

Stack trace on Vercel:

```
Error: Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers
    at Proxy.callable (/var/task/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js)
    at Object.mutateHeaders (/opt/rust/nodejs.js)
```

i.e. the Vercel Node runtime's fetch wrapper calls `mutateHeaders` on Next's
`ReadonlyHeaders` proxy (the request store headers), which throws. Because case C
(a plain-object copy) also fails, the failure is not caused by mutating the `init`
object; forwarding the incoming `x-vercel-*` headers is what triggers it.

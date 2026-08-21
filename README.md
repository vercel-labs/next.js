# Repro: composing middleware that forward request headers (next.js#88730)

Two middleware helpers each return `NextResponse.next({ request: { headers } })`.
There is no documented way to merge their forwarded request headers.

```
npm install
npm run dev
curl -s 'http://localhost:3000/api/echo?mode=naive'        # only x-locale survives
curl -s 'http://localhost:3000/api/echo?mode=internal'      # both, via undocumented x-middleware-* headers
curl -s 'http://localhost:3000/api/echo?mode=accumulator'   # both, via a single shared Headers object
```

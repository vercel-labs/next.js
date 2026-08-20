# Repro attempt for vercel/next.js#68435 - "Improper neutralization of HTTP headers"

Minimal app that reflects user-controlled query input into response headers, both from a
Route Handler (`app/api/echo/route.js`) and from middleware (`middleware.js`).

## Run

```bash
npm install
npm run dev
# CRLF injection attempt via route handler header
curl -i "http://localhost:3000/api/echo?h=ok%0d%0aX-Injected:%201"
# CRLF injection attempt via middleware header
curl -i "http://localhost:3000/?mw=ok%0d%0aX-Injected:%201"
# benign control
curl -i "http://localhost:3000/api/echo?h=hello"
```

## Result (Next.js 14.2.4 and 16.3.1, Node 24)

CRLF is never emitted. `headers.set()` throws:

```
TypeError: Headers.set: "ok\r\nX-Injected: 1" is an invalid header value.
```

Route handler -> HTTP 500, middleware -> `x-middleware-error: TypeError`, no `X-Injected`
header ever appears in the response. Benign values are reflected normally
(`x-reflected: hello`). So response-splitting/header injection is not reproducible.

The only Next.js-emitted header a scanner may flag is `X-Powered-By: Next.js`, which can be
removed with `poweredByHeader: false` in `next.config.js`. The SSRF part of the report is
application-level `fetch(userInput)` code, not framework behavior.

# Repro: vercel/next.js#82952 — cookie set on `NextResponse.next()` is echoed into the same request's `cookies()`

## Run
```
npm install
npm run dev        # or: npm run build && npm start
curl -s http://localhost:3000/        # no Cookie header sent (browser blocked/never stored it)
curl -s http://localhost:3000/api/read
```

## Observed (next@15.5.0 and next@16.3.1-canary.26, dev + start)
Page (RSC): `cookies().get('session')` returns `{"name":"session","value":"set-by-middleware-v1"}`
and `headers().get('cookie')` is `"session=set-by-middleware-v1"`, even though the client sent no cookies.

Route handler `/api/read`: `cookies()` and the incoming cookie header are both `null` — asymmetric behaviour.

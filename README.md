# Repro for vercel/next.js#64698 — multiple `Set-Cookie` with the same cookie name

Reporter's linked repo (`yeliex/stackblitz-starters-kfmrzz`) is deleted, so this is a minimal rebuild.

## Run

```
npm install
npm run dev
# then:
curl -sD - -o /dev/null http://localhost:3000/api/test           # pages API, res.setHeader([a,b])  -> 2 headers (OK)
curl -sD - -o /dev/null http://localhost:3000/api/route-handler  # Headers.append x2               -> 2 headers (OK)
curl -sD - -o /dev/null http://localhost:3000/api/next-response  # NextResponse.cookies.set x2     -> 1 header (BUG)
curl -sD - -o /dev/null http://localhost:3000/api/cookies-api    # cookies().set x2                -> 1 header (BUG)
```

Each route sets `session=<ts>` twice, once for `Domain=.example1.com` and once for `Domain=.example2.com`.
The cookie-API routes emit only the `.example2.com` cookie: `ResponseCookies` is keyed by cookie name only,
so a second `set()` with the same name (different `Domain`/`Path`) overwrites the first instead of adding a
second `Set-Cookie` header. Raw header APIs behave correctly on current canary.

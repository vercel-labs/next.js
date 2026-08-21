# Reproduction for vercel/next.js#75173

`NextResponse.redirect()` in middleware/proxy loses the target origin when the
redirect target host equals the host the Next.js server was started with.

## Setup

```
npm install
```

Add to `/etc/hosts` (only needed for browser verification):

```
127.0.0.1 example.test
127.0.0.1 foo.example.test
```

## Reproduce

```
npm run dev          # next dev --hostname example.test --port 3000
./repro.sh           # or open http://foo.example.test:3000/shouldredirect
```

Middleware returns `NextResponse.redirect(new URL('http://example.test:3000/login'))`.

* Expected: `location: http://example.test:3000/login` (browser lands on the apex domain)
* Actual: `location: /login`, so the browser stays on `http://foo.example.test:3000/login`

Also reproduces with `npm run build && npm run start`.

## Counter-case

Start the server without naming that host (`npm run dev:any-host`, i.e.
`--hostname 0.0.0.0`) and the same middleware returns the absolute
`location: http://example.test:3000/login`. The dev/prod router server
relativizes the middleware `location` header against its own origin
(`getRelativeURL(value, initUrl)` in
`next/dist/server/lib/router-utils/resolve-routes.js`), which drops the origin
whenever it matches the server's configured hostname, even though the incoming
request arrived on a different (sub)domain.

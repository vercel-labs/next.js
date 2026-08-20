# Repro: middleware URL normalization ignores `skipTrailingSlashRedirect` (next.js#66753)

Pages Router + `skipTrailingSlashRedirect: true` + middleware.
On **client-side** navigation the router always requests
`/_next/data/<buildId>/foo.json` (no trailing slash), even for `<Link href="/foo/">`,
so middleware sees `pathname === "/foo"`. Middleware that enforces a trailing slash
then redirects forever.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
npm test               # terminal 2 (clicks <Link href="/foo/">)
```

## Observed (next 16.3.1, `next dev`)

```
final URL: http://localhost:3000/     <- never lands on /foo/
data requests: 832                    <- all GET /_next/data/development/foo.json
[middleware] req.url= http://localhost:3000/foo | pathname= /foo
[middleware] redirecting to /foo/
... repeats forever
```

A *direct* request to `/_next/data/development/foo/.json` correctly yields
`pathname === "/foo/"`, so only the client-side data URL construction drops the slash.

## Expected

`<Link href="/foo/">` should request the `/foo/` data URL and middleware should see
`pathname === "/foo/"`, so no redirect loop occurs.

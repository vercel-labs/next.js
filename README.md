# Reproduction: middleware/proxy redirect to `http://localhost:3000` is emitted as a relative Location

Issue: https://github.com/vercel/next.js/issues/44482 (original reporter repo is deleted)

## Run

```bash
npm install
npm run dev            # next dev on port 3000
curl -sD - -o /dev/null -H "Host: foobar.localhost:3000" http://127.0.0.1:3000/
```

## Expected

`location: http://localhost:3000/signin?domainKey=foobar` (as on Vercel), so the browser
leaves the `foobar.localhost` subdomain.

## Actual (Next 16.3.1-canary.25)

```
HTTP/1.1 307 Temporary Redirect
location: /signin?domainKey=foobar
```

Server log shows the middleware built the absolute URL:
`[middleware] redirecting to http://localhost:3000/signin?domainKey=foobar`.
The browser therefore stays on `http://foobar.localhost:3000/signin?domainKey=foobar`.

## Notes

* `/sub` (redirect to `http://bar.localhost:3000/...`) and `/ext`
  (redirect to `https://example.com/...`) keep the absolute Location, so only a target
  whose host equals the server's own `localhost:<port>` gets stripped to a relative path.
* Also reproduces with `next build && next start -p 3000`; with `next start -p 3001`
  (target still `localhost:3000`) the Location stays absolute.
* Matches the reported workaround `next dev --hostname fakehostname.localhost`.

# Repro: `reactMaxHeadersLength` does not affect HTTP 431 (vercel/next.js#86208)

`reactMaxHeadersLength` only caps *outgoing* React preload `Link` response headers.
HTTP 431 "Request Header Fields Too Large" comes from Node's **incoming** request
header limit (`http.maxHeaderSize`, default 16 KB), which Next's dev/start server
does not raise and `reactMaxHeadersLength` cannot change.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # next dev with reactMaxHeadersLength: 100_000_000
npm run repro          # Chromium: 3 x 3800-byte cookies + 7830-char ?auth_token (~19 KB request)
# -> RES status=431 Request Header Fields Too Large

# control: same app, only Node's limit raised
npm run dev:bigheaders
npm run repro          # -> RES status=200 OK
```

Reproduces identically on next@15.5.6 (reporter's version) and next@16 canary.

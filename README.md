# Reproduction for vercel/next.js#48765

`compress: false` in `next.config.js` combined with a `middleware` that returns
`NextResponse.next()` makes the App Router return an **empty HTML body**
(`content-length: 0`), so the page is blank and Firefox/Chromium fall back to
quirks mode (`document.compatMode === "BackCompat"`).

## Run

```bash
npm install
npm run dev
curl -s -D- http://localhost:3000/   # HTTP 200, content-length: 0, empty body
```

or `./check.sh`

## Results observed

| next version | GET / (app router, compress:false + middleware) |
| --- | --- |
| 13.3.1 (as reported) | 200, `content-length: 0`, empty body, `document.compatMode = BackCompat` |
| 13.4.0 | 200, 0 bytes (still broken) |
| 13.4.19 | 200, ~3.8 kB HTML (fixed) |
| 16.3.1-canary.7 (dev and `next build && next start`) | 200, full HTML (not reproducible) |

Change `"next"` in `package.json` to `canary` (and drop `experimental.appDir`)
to verify current behaviour.

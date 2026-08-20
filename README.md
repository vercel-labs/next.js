# Repro: `experimental.testProxy` breaks `next/font` (vercel/next.js#66238)

`experimental.testProxy` installs an MSW `ClientRequestInterceptor` over `node:http`/`node:https`
(`next/dist/experimental/testmode/httpget`). The interceptor replays the request through `fetch` and
responds with an **already decompressed** body while **keeping the `content-encoding: gzip` response
header**. `next/font/google` fetches its CSS with `next/dist/compiled/node-fetch`, which then tries to
gunzip plain text and throws `Z_DATA_ERROR: incorrect header check`.

## Run (needs network access to fonts.googleapis.com)

```bash
npm install

# 1) minimal, no Next.js server needed
npm run repro

# 2) full app
TEST_PROXY=1 npm run dev   # font download fails, fallback font is used
npm run dev                # control run, font loads fine
```

`next.config.js` enables `experimental.testProxy` only when `TEST_PROXY=1`, so the same app is the control.

## Observed with next@14.2.5 (Node 24)

`npm run repro`:

```
without interceptor: 200 content-encoding= gzip len= 219
with interceptor: status 200 content-encoding= gzip
with interceptor FAILED: Invalid response body while trying to fetch
  https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap: incorrect header check Z_DATA_ERROR
```

`TEST_PROXY=1 npm run dev` then `curl http://localhost:3000/`:

```
Invalid response body while trying to fetch https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap: incorrect header check
Retrying 1/3... 2/3... 3/3...
FetchError ... errno: 'Z_DATA_ERROR', code: 'Z_DATA_ERROR'
 x Failed to download `IBM Plex Mono` from Google Fonts. Using fallback font instead.
```

## Version notes

- Fails: 14.2.5 (issue also reports 14.2.x, 14.3-canary, 15.0.x).
- Does not fail on 15.5.23 or 16.3.1: `next/font` no longer uses the bundled `node-fetch`
  (it fetches with raw `node:http` and no gzip), and runtime `fetch` through the interceptor no longer
  exposes a stale `content-encoding` header. Bump `next` in `package.json` to re-check.

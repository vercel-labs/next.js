# Reproduction for vercel/next.js#71842 — `next/image` fails for slow / flaky remote upstreams

The original report (https://github.com/vercel/next.js/issues/71842) points at third-party
hosts (`ik.imagekit.io`, `mp.softly.uz`) that are no longer reliable, so this repro replaces
them with a tiny local "remote image host" whose latency and failure mode are deterministic.

`upstream.mjs` serves a valid JPEG on:

| path | behavior |
| --- | --- |
| `/fast.jpg` | responds immediately |
| `/slow.jpg?delay=8000` | responds after 8s (above Next's hard-coded 7s image fetch timeout) |
| `/flaky.jpg` | drops the TCP connection (transient upstream failure) |

## Run

```bash
npm install
npm run upstream        # terminal 1: the remote image host on 127.0.0.1:4001
npm run dev             # terminal 2: next dev on port 3001
npm run repro           # terminal 3: hits /_next/image and the upstream directly
# or open http://localhost:3001 and compare <Image> with <img>
```

`next start` behaves the same (`npm run build && npm start`).

## Observed (Next 15.0.1, and Next 16.3.1-canary.25 with `ALLOW_LOCAL_IP=1`)

```
[slow  ] next/image  -> 504 in 7053ms :: "url" parameter is valid but upstream response timed out
[slow  ] direct/<img> -> 200 in 8007ms
[flaky ] next/image  -> 500 in 26ms  :: <!DOCTYPE html>... (unhandled "TypeError: fetch failed")
[fast  ] next/image  -> 200
```

* Any upstream image that takes longer than 7s is aborted by
  `fetchExternalImage()` in `next/dist/server/image-optimizer.js`
  (`signal: AbortSignal.timeout(7_000)`), so `<Image>` renders a broken image while the
  identical `<img src=...>` loads fine, because the browser has no such deadline.
* A transient upstream network error is not mapped to an image error either: the request
  fails with a bare `500` (dev error page HTML) instead of a useful status/message.
* Next `14.2.14` returns `200` for the same slow upstream after 8s — this is the regression
  the reporter bisected to `15.0.0`.

`ALLOW_LOCAL_IP=1` is only needed on Next versions that block private-IP remote images
(`images.dangerouslyAllowLocalIP`); it is ignored on 15.0.x.

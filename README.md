# next#69424 — a no-op `middleware.js` makes Next buffer the entire request body of API-route POSTs

Minimal reproduction of https://github.com/vercel/next.js/issues/69424 (Pages Router, `next start`).

* `pages/api/upload.js` sets `bodyParser: false` and answers `200` **without ever reading the body**.
* `middleware.js` only returns `NextResponse.next()` and never reads the body either.

## Run (Linux, node 18+)

```bash
npm install
./repro.sh 400          # middleware.js present  -> memory bloat
rm middleware.js
./repro.sh 400          # control: no middleware -> no bloat
```

`repro.sh` builds, starts `next start`, POSTs a 400 MB body to `/api/upload` with curl, and prints
the `next-server` process RSS and peak RSS (`/proc/<pid>/VmHWM`) before the request, 5 s after and
30 s after. `pages/index.js` has equivalent buttons if you prefer a browser + `docker stats`.

## Measured results

| next | middleware.js | RSS before | RSS 5 s after 400 MB POST | RSS 30 s after |
|---|---|---|---|---|
| 15.3.9 | present | 113 MB | **916 MB** | 898 MB (not released) |
| 15.3.9 | removed | 110 MB | 136 MB | 136 MB |
| 15.0.3 | present | 115 MB | **917 MB** | 900 MB |
| 14.2.7 | present | 102 MB | **909 MB** | 895 MB |
| 14.2.7 | removed | 96 MB | 192 MB | 192 MB |
| 15.5.23 / 16.3.1 | present | ~109 MB | ~171 MB | ~159 MB |

The whole body is read into memory before the API route runs even though nothing reads it, and it is
retained afterwards. On 15.5.23 / 16.3.1 the newer `middlewareClientMaxBodySize` default (10 MB) caps
this: the server logs `Request body exceeded 10MB for /api/upload` and RSS stays flat.

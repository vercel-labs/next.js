# Reproduction: Turbopack dev server memory growth on serial page requests

Upstream issue: https://github.com/vercel/next.js/issues/97379

Minimal App Router app (`app/layout.js` + `app/page.js`, static page, no middleware,
no API routes, no extra dependencies). `measure.sh` starts `next dev --turbopack`,
drives serial `GET /` requests in batches and samples the RSS of the dev-server
process tree after each batch (idle settle of 15s between samples).

## Run

```bash
npm install
bash measure.sh 250 6      # 6 batches x 250 serial GET / requests
```

Optionally under a memory limit to observe the OOM kill reported upstream:

```bash
docker run --rm -it -m 2g -v "$PWD":/app -w /app node:20-alpine \
  sh -c "apk add --no-cache bash curl procps && npm install && bash measure.sh 250 6"
```

## Measured (Linux, Node 24, 2 vCPU)

Next.js 15.5.23 (`next@backport`), `next dev --turbopack`:

| batch (250 serial GET /) | rss_end_kb | delta_kb |
| --- | --- | --- |
| baseline | 762,156 | – |
| 1 | 1,171,348 | +409,192 |
| 2 | 1,449,656 | +278,308 |
| 3 | 1,874,620 | +424,964 |
| 4 | 2,089,404 | +214,784 |
| 5 | 2,263,416 | +174,012 |
| 6 | 2,347,684 | +84,268 |

1,500 requests => 762 MB -> 2.35 GB (already past a 2 GiB cgroup limit).
Growth is in the `next-server (v15.5.23)` child process (+508 MB -> +1,493 MB over
500 requests, ~2 MB/request); the parent CLI processes stay flat.

Next.js 16.3.1 with the identical app and driver plateaus:
baseline 488,676 kb, then per-batch deltas +126,788 / +19,976 / +60,456 / +1,048 /
-3,032 / +18,312 kb — about 712 MB after 1,500 requests.

Change `next` in `package.json` to `16.3.1` to compare.

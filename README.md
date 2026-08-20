# Reproduction: memory usage with Next.js Image Optimization enabled

Issue: https://github.com/vercel/next.js/issues/54482

Measures RSS of `next start` while `/_next/image` performs **unique (cache-MISS)
optimizations** of a large source image, and compares it against serving the
exact same bytes through a route handler with no optimizer involved.

`app/api/img/[id]/route.js` serves the same `public/big.jpg` under unlimited
distinct paths, so every `/_next/image?url=/api/img/N` request is a real
optimizer MISS (query strings are not allowed in the local `url` param).

## Run

```bash
npm install
npm run generate-image            # public/big.jpg -> 6000x4000, ~21 MB JPEG
npm run build
npm start &                       # note the next-server PID (pgrep -f 'next-server \(v')

SERVER_PID=<pid> TOTAL=400 npm run hammer       # sequential unique optimizations
SERVER_PID=<pid> CONC=10 TOTAL=100 npm run concurrent   # 10 concurrent optimizations
SERVER_PID=<pid> TOTAL=400 npm run baseline     # same bytes, optimizer bypassed
SERVER_PID=<pid> npm run badq                   # 6000 requests rejected with 400
```

## Measured on next@16.3.1-canary.25, sharp 0.35.3, Node 24.17.0, 4 GB Linux box

| scenario | requests | server RSS |
| --- | --- | --- |
| idle after `next start` | 0 | **97 MB** |
| baseline: `/api/img/N` (no optimizer) | 400 | 102 -> **228 MB** |
| sequential `/_next/image` MISSes | 1550 | 97 -> **570 MB** (plateau, 355 MB after 3 min idle) |
| 10 concurrent `/_next/image` MISSes (`w=3840`) | 100 | 97 -> **peak 1229 MB**, 868 MB afterwards |
| requests rejected with 400 (`q` not allowed) | 6000 | 97 -> 258 MB (drops to 163 MB when idle) |

Side effect: `.next/cache/images` grew to **622 MB** for ~1150 optimized
variants and is never pruned.

## Notes

- Sequential traffic plateaus, so this is not an unbounded JS-heap leak on
  canary, but steady-state RSS stays 3.5-6x the idle baseline and never returns
  to it.
- Concurrency is the dangerous multiplier: 10 in-flight optimizations of one
  6000x4000 source push RSS past 1.2 GB, which is what OOM-kills 512 MB / 1 GB
  containers as reported in #49929 / #54482.

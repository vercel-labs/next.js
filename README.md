# Repro harness for vercel/next.js#44685 — "Another Memory Leak in `next/image`"

The issue's original reproduction (`jaunruh/next-image-test`) is a Docker-only Next 13.1
app on `ubuntu:jammy` **without `sharp` installed**, so it cannot be run on current
Next.js. This is a minimal, self-contained harness that stresses the built-in image
optimizer on a glibc host and reports the `next-server` RSS while it runs.

## Run

```bash
npm install
npm run gen          # 60 large source JPEGs into public/
npm run build
npm start &          # note the next-server pid
SERVER_PID=<pid> npm run load
```

`scripts/load.mjs` issues ~5,000 **distinct** `(image, width, quality)` optimizer
requests (never a cache hit) and prints the server RSS every 120 requests.

## Result on Next.js 16.3.1-canary.25 / sharp 0.34.5 / glibc 2.43

RSS rises from ~95 MB to a plateau of ~240–300 MB after the first few hundred
optimizations and stays flat for the remaining ~4,500 distinct optimizations, then
stays flat over 1,500 additional page renders. No unbounded growth.

What *does* grow monotonically is the on-disk optimizer cache
(`.next/cache/images`): 4,924 entries / 411 MB after the run, none pruned even
though every entry was written with `minimumCacheTTL: 60`. Re-requesting an
expired variant overwrites the entry in place, but expired entries for variants
that are never requested again are never deleted. In containers this shows up as
ever-growing page-cache/"memory" usage, which matches the later comments on the
issue.

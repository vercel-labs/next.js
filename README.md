# Repro: Next.js #40481 — Multi Zone relative routing (`../`) ignores the zone boundary

Two zones:
- `home` (port 3000) — no basePath, rewrites `/blog*` to the blog zone
- `blog` (port 4000) — `basePath: '/blog'`

From `http://localhost:3000/blog/post`, clicking a `<Link href="../">` (or `router.push('../')`)
should leave the blog zone and land on the home zone (`/`).
Since v12.2.x (commit 87826ee) the relative URL is handled by the client router and the
basePath is re-added, so it navigates to `/blog` (or `/blog/blog`) instead of `/`.

## Run

```bash
pnpm --prefix blog install && pnpm --prefix home install
pnpm --prefix blog dev   # port 4000
BLOG_URL=http://localhost:4000 pnpm --prefix home dev  # port 3000
# open http://localhost:3000/blog/post and click "Up one level (../)"
```

## Observed (next@16.3.1-canary.24, Turbopack dev)

| trigger on /blog/post | resulting URL |
| --- | --- |
| `<Link href="../">` | `/blog` (blog zone index) |
| `router.push('../')` | `/blog` (blog zone index) |
| `<a href="/">` | `/` (home zone) — correct |

With next@12.1.6 the same `<Link href="../">` navigates to `/` (leaves the zone),
so this is a regression from 87826ee186fc65c0b3b4288791f4b575158371c9: the relative URL is
now resolved against the basePath-stripped pathname and the basePath is re-added.

`verify.mjs` is a Playwright script that clicks each trigger and prints the resulting URL.

# Reproduction — next dev (Turbopack) serves stale CSS after edits (vercel/next.js#86306)

Next.js `16.0.2-canary.24` (pinned by `pnpm-lock.yaml`), Turbopack dev server.

## Run

```bash
pnpm install
pnpm dev            # terminal 1
npm i playwright && npx playwright install chromium
N=8 node scripts/hmr-css-check.mjs   # terminal 2
```

The script rewrites the `h1 { color: ... }` rule in `app/globals.css` repeatedly and,
for each edit, waits up to 8s for the browser to show the new color. On failure it
also re-fetches the served CSS chunk, reloads the page (F5) and re-saves the file
with identical content.

## Observed (Linux, Node 24)

Roughly 2 out of 3 edits are lost. Example output:

```
3 STALE: dom=rgb(102, 6, 10) want=rgb(103, 9, 15)
   served CSS: [{"h":".../_next/static/chunks/%5Broot-of-the-server%5D__28bc9c2a._.css","rule":"h1 {\n  color: #66060a !important;\n}"}]
   after F5: rgb(102, 6, 10)
   after rewriting same content: rgb(102, 6, 10)
```

* The dev server itself serves the **previous** edit's CSS, so this is not a browser cache issue.
* `F5` does not fix it, and saving the same content again does not fix it; only restarting `next dev` does.
* The terminal prints fewer `✓ Compiled in XXms` lines than there were saves (23 lines for 30 saves in one run).

Manual reproduction (as in the issue): run `pnpm dev`, open http://localhost:3000
and change `h1 { color }` in `app/globals.css` a few times.

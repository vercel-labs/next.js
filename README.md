# Reproduction: vercel/next.js#48642

App Router `output: 'export'` client navigation when the host serves the RSC
payload (`*.txt`) **without a `Content-Type` header** — this is exactly what
Tauri's asset protocol does (see tauri-apps/tauri#6762).

`server.js` is a ~30 line static file server for `out/` that intentionally omits
`Content-Type` for `.txt` files and sets it correctly for everything else.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm run serve &          # http://localhost:3123
npm run verify           # clicks <Link> and router.push('/example')
```

## Results (headless Chromium)

| next | URL after navigation | rendered |
| --- | --- | --- |
| 13.4.0 / 13.4.4 | `/example.txt` | no — raw RSC flight text is displayed |
| 13.4.8 | `/exa` (truncated) | no — 404 |
| 13.4.12, 13.5.11, 14.2.35, 16.3.1-canary.25 | `/example` | yes |

So the reported behaviour reproduces on the versions from the issue era and is
fixed on current versions: when the payload response has no RSC content type,
Next.js no longer hard-navigates the browser to the `.txt` URL.

Change `next` in package.json to try other versions.

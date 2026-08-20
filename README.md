# next.js#57108 — first-load JS growth after 13.4.19

Minimal pages-router app (`pages/index.tsx` returns `null`) built against several
Next.js versions. `measure.mjs` gzips the first-load chunks listed in
`.next/build-manifest.json` (`/_app` + `/`, polyfills excluded) so versions that no
longer print a size table (Next 16) can be compared too.

```bash
./run.sh
```

Measured (Node 24, linux/x64, npm 11):

| next | first-load JS (gzip) | main/runtime chunk |
| --- | --- | --- |
| 13.4.19 | 73.9 kB | 28.7 kB |
| 13.5.2 | 76.0 kB | 30.9 kB |
| 13.5.4 | 77.5 kB | 32.1 kB |
| 13.5.6 | 77.6 kB | 32.1 kB |
| 16.3.1 (latest, React 19) | 108.9 kB | – |
| 16.3.1-canary.25 (React 19) | 105.3 kB | – |

`next build` output for 13.4.19 → 13.5.6 (pages `/`): 75.5 kB → 79.3 kB First Load JS (+5%),
entirely in the Next runtime `main` chunk (29.4 kB → 32.9 kB); `framework` (React) is unchanged.

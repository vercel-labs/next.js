# Reproduction for vercel/next.js#97344

`next/font/google`: intermittent `Module not found: Can't resolve
'@vercel/turbopack-next/internal/font/google/font'` for CJK font families with
Turbopack in `next dev` (and, less often, `next build`). Regression in 16.3.0
(16.2.12 is fine).

## Files

- `app/layout.jsx` – loads 7 Japanese families (`Noto_Sans_JP`, `Noto_Serif_JP`,
  `BIZ_UDGothic`, `M_PLUS_1p`, `Shippori_Antique_B1`, `Zen_Kaku_Gothic_New`,
  `Zen_Old_Mincho`). Together they expand to ~1480 individual `woff2`
  unicode-range slices (~34 MB) that Turbopack downloads while compiling.
- `tools/throttle-proxy.js` – a small HTTP `CONNECT` proxy with an aggregate
  download bandwidth cap, used to emulate a normal/slow network. Turbopack's
  font fetch client honours `HTTPS_PROXY`.
- `scripts/repro.sh` – runs `next dev` behind the proxy and issues one request.

## Run

```bash
pnpm install
./scripts/repro.sh          # add PROXY_RATE=<bytes/sec> to tune (default 700 KB/s)
```

Observed with `next@16.3.0` and `next@16.3.1-canary.15`:

```
GET / -> HTTP 500
font module-not-found errors: 266
font fetch failures:          109
```

and in the dev server log:

```
⨯ [next]/internal/font/google/zen_old_mincho_<hash>.module.css:...
Error: Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
...
Connection timed out when requesting https://fonts.gstatic.com/s/zenoldmincho/...106.woff2
```

With `next@16.2.12` and the identical proxy/bandwidth: `GET / -> HTTP 200`, zero
errors. On a fast, unthrottled connection 16.3.0 also succeeds, which is why the
failure looks intermittent/machine-dependent in the original report.

## Why

16.3.0 added a fetch budget for Turbopack's Google Fonts client
(`crates/next-core/src/next_config.rs`): dev uses `connect_timeout: 5s`,
`timeout: 10s`, `max_retries: 1`; build uses `10s/30s`. 16.2.12 built the
`reqwest` client without any timeouts. When a font file fetch fails,
`NextFontGoogleFontFileReplacer` returns `ResolveResult::unresolvable()`
(`crates/next-core/src/next_font/google/mod.rs`), which surfaces as
`Module not found` for the internal font specifier and 500s the route. CJK
families are hit first because a single family fans out to hundreds of requests.

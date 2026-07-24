# Server Action stalls under `next start` (HTTP/1.1) when the prefetch burst exhausts Chrome's connection pool

Minimal reproduction for a Next.js App Router bug.

## Mechanism (one paragraph)

Under self-hosted `next start` the browser talks to the server over **plain HTTP/1.1**, where Chrome opens **at most 6 connections per origin**. After a client-side navigation the App Router fires a burst of `_rsc` **prefetch** GETs for the links on the page. On a busy/slow server those prefetches are still in flight when the user acts, so all 6 sockets are occupied. A **Server Action** submitted at that moment (and the revalidation it should stream back) is stuck behind the prefetch queue: the whole round trip is stalled for as long as the pool stays saturated. The click appears to do nothing — the UI stays frozen on the pre-action server-component value — and on a real CI runner, where the prefetch responses stay slow, it hangs until a hard reload. None of this happens over **HTTP/2** (Vercel, or any h2 reverse proxy), which multiplexes and has no 6-connection cap. This is the transport-level cause behind the long-standing "Server Actions hang / forever pending" reports and the "mutation commits but the UI keeps stale props" variant.

## Reproduce

```bash
npm i          # also installs the Chromium Playwright drives
npm run repro
```

`npm run repro` builds the app, starts `next start` behind a ~40-line HTTP/1.1 latency proxy
(`scripts/slow-rsc-proxy.mjs`, which holds `_rsc` prefetch responses ~4s to emulate a starved
2-core runner), then drives a real Chromium through the **same** scenario twice — once with the
prefetch pool saturated (**treatment**), once without (**control**, which stands in for HTTP/2,
since h2 has no per-origin connection cap). Each run navigates home → `/status`, clicks **Mark
ready** (a Server Action that flips a server-side value `draft → ready` and calls
`revalidatePath`), and polls both the rendered UI and the server truth (`GET /api/state`, fetched
straight from upstream so it bypasses the browser pool).

## Expected output

```
════════════════════════════════════════════════════════════
 Server Action under HTTP/1.1 prefetch-pool exhaustion
════════════════════════════════════════════════════════════
 CONTROL   (pool OK ≈ HTTP/2)   UI updated after click : 278ms
                               timeline (250ms/step)  : dRRRRRRRRRRRRRRRRRRRRRRR
 TREATMENT (HTTP/1.1 pool full) UI updated after click : 3876ms
                               timeline (250ms/step)  : dddddddddddddddRRRRRRRRR
                               at 2500ms → UI="draft", server="draft"
                               aborted RSC requests   : 6 (e.g. GET /item/39?_rsc=...)
  legend: d = UI shows "draft" (pre-action)   R = UI shows "ready"   . = transient
════════════════════════════════════════════════════════════
 PASS ✅  BUG REPRODUCED
════════════════════════════════════════════════════════════
```

The two runs are the same code and the same click. With the pool healthy the UI repaints in
**~0.3s**; with the HTTP/1.1 pool exhausted by the prefetch burst the Server Action is still
frozen on `draft` **~4s later** (the whole time the proxy holds the pool), and several RSC
requests are aborted (`net::ERR_ABORTED`) along the way. The 4s here is just the proxy's hold
duration — on a real runner where the pool never drains, the stall is unbounded (the action
"hangs" / the UI "never updates").

## Why HTTP/2 / Vercel does not reproduce

The failure is a property of the **HTTP/1.1 six-connections-per-origin limit**. Over HTTP/2 the
prefetch burst and the Server Action multiplex over a single connection, so nothing is starved —
the same build deployed on Vercel, or self-hosted behind any HTTP/2 reverse proxy (Caddy, nginx,
Cloudflare, …), updates immediately. The `control` run in `npm run repro` demonstrates this by
disabling the pool pressure; it is the HTTP/2-equivalent baseline and always repaints in well
under a second.

## What's in here

| Path | Role |
| --- | --- |
| `app/(dash)/layout.tsx` | Sidebar of ~60 `<Link>`s → the client-navigation `_rsc` prefetch burst |
| `app/(dash)/status/page.tsx` + `actions.ts` | `/status` page + the **Mark ready** Server Action (`revalidatePath`) |
| `app/api/state/route.ts` | `GET /api/state` — the raw server-side value, the ground-truth probe |
| `components/prefetch-pressure.tsx` | Keeps the prefetch burst topped up so the condition is steady/observable on a fast dev machine (a stand-in for a real busy dashboard; disabled in the control run). Issues only GETs the app already serves — it mutates nothing |
| `scripts/slow-rsc-proxy.mjs` | HTTP/1.1 latency proxy: holds `_rsc` responses ~4s, passes everything else through |
| `scripts/repro.mjs` | Builds, starts, and runs the treatment-vs-control demonstration |
| `lib/store.ts` | Dependency-free server-side value (a JSON file), so "the server committed" is unambiguous |

## Environment

- `next` 16.3.0-canary.95, `react`/`react-dom` 19.2.8, App Router, Cache Components on (mirrors the original
  app; the failure does not depend on it).
- Reproduced on Linux, Node 24, Chromium (Playwright).
- `next build` + `next start` (self-hosted, plain HTTP/1.1) — **not reproducible in `next dev` or
  behind HTTP/2**.

## Tuning

`RSC_DELAY_MS` (proxy hold, default `4000`) sets how long the pool stays saturated — i.e. how long
the stall lasts. `PROBE_MS` (default `2500`) is when the script checks "has it updated yet?". A
larger `RSC_DELAY_MS` widens the stall; the default reproduces on a fast machine.

## License

MIT

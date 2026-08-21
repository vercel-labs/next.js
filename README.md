# next#77993 — chunks on dynamic/intercepting routes 404 when the URL is partially encoded

Static chunks for parallel/intercepting + dynamic routes live at paths containing
`@modal`, `(.)photos` and `[id]`. Since #70256, `next start` only serves the
fully-encoded or fully-decoded form of that path. Proxies that partially decode
URLs (Google Cloud Run / Firebase App Hosting, some AWS setups) send e.g.
`/_next/static/chunks/app/@modal/(.)photos/%5Bid%5D/page-<hash>.js`, which 404s.

```bash
npm install
npm run build   # next build --webpack (turbopack builds emit flat chunk names)
npm run verify  # boots next start and probes the three URL forms
```

Observed with next@16.3.1 and next@15.2.5:

| request path | status |
| --- | --- |
| `app/%40modal/(.)photos/%5Bid%5D/page-<hash>.js` | 200 |
| `app/@modal/(.)photos/[id]/page-<hash>.js` | 200 |
| `app/@modal/(.)photos/%5Bid%5D/page-<hash>.js` | **404** |
| `app/%40modal/(.)photos/[id]/page-<hash>.js` | **404** |

Note: the reporter's original repro uses `next@latest`; on Next 16 the default
Turbopack build emits flat hashed chunk names, so the build must use `--webpack`
to produce the affected nested chunk paths.

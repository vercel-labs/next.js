# Repro: all client components of a route ship in one chunk (issue #58269)

Minimal reproduction of https://github.com/vercel/next.js/issues/58269

Two independent client components (`moment` ~350kB, `jquery`) are conditionally
rendered from server components based on cookies. Regardless of which one (if
any) is actually rendered, a single client chunk containing **both** is emitted
and downloaded by the browser.

## Run

```bash
pnpm install
pnpm build
pnpm check          # greps built client chunks for both fingerprints
pnpm start          # then: node verify.mjs (Playwright network check)
```

## Observed (next@16.3.1-canary.24, Turbopack)

```
.next/static/chunks/17s8qa28t2din.js  388kB  moment=true jquery=true
```

`verify.mjs` shows the browser downloads that 354kB (transferred, uncompressed
text) chunk containing **both** `MOMENT_CC_FINGERPRINT` and
`JQUERY_CC_FINGERPRINT` on the initial render, when *neither* client component
is rendered.

Same result with the version from the original report (next@14.0.2-canary.27,
webpack): one `static/chunks/app/page-*.js` of 275kB containing both
fingerprints.

## Expected

Each client component should get its own chunk so that only the rendered one is
downloaded.

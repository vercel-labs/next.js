# Reproduction: route announcer `style.cssText` blocked by nonce-based CSP (vercel/next.js#98257)

App Router app whose middleware sets a nonce-based CSP with
`style-src 'self' 'nonce-...'` (no `'unsafe-inline'`) plus
`style-src-attr 'unsafe-inline'`.

`AppRouterAnnouncer`'s `getAnnouncerNode()` assigns `container.style.cssText`
and `announcer.style.cssText`. Chromium enforces `style.cssText` writes against
`style-src`, so the assignment is blocked and a CSP violation is reported on
every App Router boot.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm run start
# open http://localhost:3000 in Chromium and check the console
```

Automated check (Chromium via Playwright):

```bash
npm install playwright && npx playwright install chromium
node check.mjs
```

## Result of running this harness (Chrome 140.0.7339.207 and Chromium 151)

`node probe140.mjs` / `probe.mjs` / `devprobe.mjs` show:

- `element.style.cssText = ...` (a CSSOM write) is **not** blocked by
  `style-src` in either Chromium 140 or 151, with or without
  `style-src-attr 'unsafe-inline'`. The announcer's styles are always applied
  (`getComputedStyle(announcer).position === 'absolute'`) and no
  `securitypolicyviolation` event is fired for it.
- `setAttribute('style', ...)` *is* blocked when `style-src-attr` is absent,
  reported as `effectiveDirective: 'style-src-attr'`. Next.js does not use that
  vector for the announcer.
- In `next dev`, the "Applying inline style violates ..." console errors do
  occur, but their `effectiveDirective` is `style-src-elem` and their
  `sourceFile` is `next-devtools`, i.e. dev-overlay `<style>` elements injected
  without a nonce — not the route announcer.

## Files

- `middleware.ts` – nonce CSP; `/strict/*` additionally omits `style-src-attr`.
- `probe.mjs` / `probe140.mjs` – attribute CSP violations by directive/source
  and check whether `cssText` took effect.
- `devprobe.mjs` – same against `next dev` on port 3001.
- `check.mjs` – client-side navigation + announcer state.

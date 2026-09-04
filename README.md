# next#98259 — route announcer `style.cssText` vs. nonce-based CSP

Verification repro for https://github.com/vercel/next.js/issues/98259 (Next.js 16.3.0, Chromium 140).

Repaired from the reporter's repo (`BekirEfeoglu/next-csp-announcer-repro`):

- `proxy.ts` now also sets `Content-Security-Policy` on the **request** headers, which is
  what Next.js reads to nonce its own script tags. Without it every inline bootstrap script
  is blocked, the app never hydrates and the announcer is never mounted.
- `app/layout.tsx` sets `export const dynamic = "force-dynamic"`, because nonce propagation
  requires dynamic rendering (the original repro prerendered `/` and `/second` statically).

## Run

```bash
npm install
npm run build && npm start          # or: npm run dev
npx playwright install chromium
BASE_URL=http://localhost:3000 npm run verify
```

`scripts/verify-announcer-csp.js` reads the `next-route-announcer` element out of the DOM,
reports the shadow-root announcer's `style` attribute + computed styles, and collects every
`securitypolicyviolation` event (effective directive + source file).

## Result

The announcer's `style.cssText` write is **not** blocked:

```
containerStyleAttr: "position: absolute;"
announcerStyleAttr: "position: absolute; border: 0px; height: 1px; margin: -1px; padding: 0px;
                     width: 1px; clip: rect(0px, 0px, 0px, 0px); overflow: hidden;
                     white-space: nowrap; overflow-wrap: normal;"
announcerComputedHeight: "1px", announcerComputedOverflow: "hidden"
violations: []            # production build
```

Same result with the reporter's unmodified `proxy.ts` in `next dev`, and also with
`style-src-attr 'unsafe-inline'` removed entirely (only `style-src 'self' 'nonce-…'`):
the announcer style attribute still lands; the single violation in that variant is
`style-src-attr` for the page's own server-rendered `style={{ padding: 24 }}` attribute.

In `next dev` the console fills with "Applying inline style violates …" — all 67 recorded
violations have effective directive `style-src-elem` and source
`_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index_*.js`, i.e. the
dev-tools overlay injecting `<style>` elements, not the route announcer.

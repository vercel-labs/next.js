# next/image emits an inline `style` attribute that a strict CSP blocks (vercel/next.js#61388)

Minimal reproduction. Verified on `next@16.3.1-canary.25` (also reported on 14.1.x).

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
# open http://localhost:3000 in Chrome and check the console
```

`middleware.js` sends `style-src 'self'` (no `'unsafe-inline'`, no `'unsafe-hashes'`).
`script-src` is intentionally permissive so the only violation reported is the image one.

## Expected

No CSP violation.

## Actual

`next/image` always renders an inline style attribute:

```html
<img alt="Next.js Logo" loading="lazy" width="180" height="38" decoding="async"
     data-nimg="1" style="color:transparent" src="/next.svg">
```

Chrome console:

> Refused to apply inline style because it violates the following Content Security Policy
> directive: "style-src 'self'". Either the 'unsafe-inline' keyword, a hash
> ('sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='), or a nonce ('nonce-...') is required
> to enable inline execution. Note that hashes do not apply to event handlers, style attributes
> and javascript: navigations unless the 'unsafe-hashes' keyword is present.

Source: `packages/next/src/shared/lib/get-img-props.ts` – `showAltText ? {} : { color: 'transparent' }`
(and the `fill` / `placeholder` branches add more inline styles).

Known workarounds: pass `style={{ color: undefined }}`, or build the tag manually with `getImageProps`.

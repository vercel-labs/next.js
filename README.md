# Reproduction for vercel/next.js#49799

`loading.js` is skipped when soft-navigating to an ISR page that is generated
on-demand (`generateStaticParams()` returning `[]` + `dynamicParams` + `revalidate`).
The router waits for the full RSC payload (~1.5s here) while the previous page stays
visible. The same slow page rendered with `dynamic = 'force-dynamic'` does show `loading.js`.

The other half of the original report (hard navigation / full page reload with
`prefetch={false}` under `app/[lang]`) does NOT reproduce anymore: navigation is soft
(no document request, `window` state preserved) on next@canary and next@14.2.35.

## Run

```bash
npm install
npm run build
npm start           # http://localhost:3000
node nav-test.mjs http://localhost:3000 /en/go no-prefetch isr     # -> anyLoading: false  (bug)
node nav-test.mjs http://localhost:3000 /en/go slow-np      dyn     # -> anyLoading: true   (control)
```

`nav-test.mjs` (requires `npx playwright install chromium`) clicks the link, polls the
document text every 80ms, and reports whether `loading.js` was ever rendered, plus
whether the navigation was soft (`marker=true`, no document requests).

Routes:
- `app/[lang]/publication/[...slugs]` – on-demand ISR page, 1.5s render, has `loading.js`
- `app/[lang]/slow` – `force-dynamic`, 1.5s render, has `loading.js` (control, works)
- `app/plain/publication/[...slugs]` – same ISR page without the `[lang]` segment (also affected)

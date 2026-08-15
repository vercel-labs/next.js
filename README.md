# Reproduction for vercel/next.js#97417

Stale `document.title` when client-navigating to a dynamic route with `generateMetadata`,
after a browser back navigation, when `cacheComponents` + `partialPrefetching` are enabled.

Next.js 16.3.0, React 19.2.7.

## Run (production build required)

```bash
npm install
npm run build
npm start   # http://localhost:3000
```

## Steps

1. Open `/nav-test`.
2. Click `bitcoin` (a `router.push('/coin/bitcoin')`). Title becomes `Bitcoin`. Correct.
3. Press the browser back button (back to `/nav-test`).
4. Click `ethereum`. URL and page content become `/coin/ethereum` / `ethereum`, but the tab
   title stays `Bitcoin`.
5. Repeat: every subsequent push shows the title of the *previously* visited coin (off by one).
   A full page reload fixes the title.

## Notes

- Only reproduces with `next build` + `next start`; `next dev` is fine.
- Removing `partialPrefetching: true` (leaving `cacheComponents: true`) makes it disappear.
- No back navigation (fresh full load of `/nav-test` each time) also makes it disappear.

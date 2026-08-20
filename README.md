# Repro: client-side `redirect()` is swallowed by user-land error boundaries (vercel/next.js#62458)

`redirect()` is documented as callable during the render of a Client Component, but it is
implemented by throwing an error with `digest = NEXT_REDIRECT;...`. Any user-land
`componentDidCatch` / `getDerivedStateFromError` boundary above the component catches it
first, so the navigation never happens and the fallback UI is shown instead.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
```

- `/` → click "redirect during render": stays on `/`, renders
  `CAUGHT BY ERROR BOUNDARY: digest=NEXT_REDIRECT;replace;/target;307;`
- `/no-boundary` → same component without the boundary: navigates to `/target` as documented

Reproduced with Next.js 16.3.1 / React 19.2.0 in both `next dev` and `next start`.

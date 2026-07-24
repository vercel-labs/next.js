# Sidebar hydration reproduction

Next.js development-mode reproduction for issue #96129, pinned to the latest canary tested.

## Automated reproduction

```bash
npm install
npx playwright install chromium
npm run test:repro
```

The passing reproduction test records the current faulty sequence: the head script changes `data-sidebar-state` to `collapsed`, development hydration removes the attribute, `localStorage` remains `collapsed`, and the sidebar finishes at its expanded width.

## Manual reproduction

1. Run `npm install && npm run dev` and open `http://localhost:3000`.
2. In DevTools, run `localStorage.setItem("sidebarState", "collapsed")`.
3. Reload and inspect `<html>` through hydration.
4. Expected: `data-sidebar-state="collapsed"` remains and the sidebar is 64px wide.
5. Actual in development: the attribute is removed and the sidebar expands to 272px.

`next.config.ts` enables Cache Components and Partial Prefetching.

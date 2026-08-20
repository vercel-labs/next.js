# Repro for vercel/next.js#52558 — client components in root layout re-render / remount on navigation (production only)

Root layout renders two client components: `Navbar` (plain) and `MemoNavbar` (wrapped in `React.memo`, holds `useState`).
Each tracks render count on `window.__navbarRenders` / `window.__memoRenders`, mount count (`useEffect(..., [])`) on
`window.__navbarMounts` / `window.__memoMounts`, and a visible counter button.

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

Click the two counter buttons, then navigate `Homepage <-> Info` via the `<Link>`s and watch the console /
`window.__*` counters.

## Observed

- next 15.5.6, `next build && next start`: every `<Link>` navigation re-renders both layout client components;
  the `React.memo` one is **remounted** (mount effect re-runs) and loses its `useState` value (counter resets to 0).
- next 15.5.6, `next dev`: no re-render, no remount, state preserved.
- next 16.0.3 and 16.3.1-canary.25: no re-render, no remount, state preserved (production build) — appears fixed on 16.x.

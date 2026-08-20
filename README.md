# Reproduction for vercel/next.js#45610 — `useSearchParams` on iOS Safari makes the page scroll down

Minimal app-router reproduction (Next.js canary).

- `app/page.tsx` — long page, `useSearchParams()` in a client component (wrapped in `<Suspense>`, required since Next 14).
- `app/no-hook/page.tsx` — identical page **without** the hook (control).
- `check.mjs`, `check2.mjs`, `check3.mjs` — Playwright WebKit (iPhone 14 Pro Max emulation) probes that sample `window.scrollY` after load, reload and history navigation.

## Run

```bash
npm install
npm run build
npm start            # http://localhost:3000  (/ = with hook, /no-hook = control)
node check2.mjs http://localhost:3000/ with-hook
node check2.mjs http://localhost:3000/no-hook no-hook
```

Open `/` and `/no-hook` on a real iPhone (iOS Safari) and compare the initial scroll position.

## What was observed in the sandbox (headless WebKit, iPhone 14 Pro Max emulation)

- Next.js 16.3.1-canary.25: `window.scrollY === 0` on load, reload and forward navigation for both pages. No spurious scroll.
- Next.js 13.1.7-canary.5 (version in the report, no Suspense boundary): the page opts out of prerendering entirely — the served
  HTML is `<!DOCTYPE html><html id="__next_error__">…` with no page content, and browser scroll restoration on reload is lost
  (scrollY 900 -> 0), whereas the control page restores correctly. That CSR bailout is the likely source of the reported
  iOS Safari scroll jump, and it no longer happens on canary (a missing Suspense boundary is now a build error, and the page is
  fully prerendered).

Real iOS Safari on a device was not available in the sandbox, so the visual scroll jump itself could not be confirmed.

# Repro: next.js#73317 — same-path `redirect()` in a Server Action blanks the page content

Minimal repro of https://github.com/vercel/next.js/issues/73317 (mirror of
https://github.com/y-hsgw/reproduction-next-app with the Next.js version pinned, plus an automated check).

`app/action.ts` is a Server Action that calls `redirect("/")` while already on `/`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev          # http://localhost:3000
npm run check        # automated: samples document.body every 25ms across the submit
```

## Result

- next 15.5.23 / 15.1.0 / 15.0.4-canary.30 (dev): after clicking "go home", `page.tsx` output
  (`Home|go home`) unmounts for ~70-280ms; only the layout (`Header|Footer`) is rendered.
  `window` state survives, so it is a client-side re-render, not a full reload.
- next 14.2.18: body text never changes.
- next 16.3.1: body text never changes (appears fixed on 16.x).

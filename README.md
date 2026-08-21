# Repro: ViewTransitions do not run on popstate (next#94369)

Minimal repro for https://github.com/vercel/next.js/issues/94369 on Next.js 16.2.7.

Two routes share a `<ViewTransition name="shared-box">` element of different sizes.
`app/vt-probe.tsx` patches `document.startViewTransition` and the `<ViewTransition>`
callbacks push into `window.__vtLog`, so a test can assert whether an animation ran.

## Run

```bash
npm install
npx playwright install chromium-headless-shell
npm run dev     # or: npm run build && npm start (port 3002)
node test.mjs   # BASE=http://localhost:3002 node test.mjs for prod
```

## Result (identical in `next dev` and `next start`)

```json
{
  "linkForward":    { "log": ["startViewTransition", "onShare"], "boxWidth": 300 },
  "popstateBack":   { "log": [], "boxWidth": 80 },
  "linkBack":       ["startViewTransition", "onShare"],
  "popstateForward": []
}
```

`<Link>` navigation starts a view transition; browser back/forward (popstate)
updates the DOM (box resizes) but never calls `document.startViewTransition`,
so no animation runs.

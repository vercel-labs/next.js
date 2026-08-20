# Reproduction for vercel/next.js#58924

GTM's "History Change" trigger is implemented by monkey-patching
`window.history.pushState` / `replaceState`. `gtm.js` loads asynchronously, so it
patches them *after* the Next.js app-router client bundle has been evaluated.

In Next.js **14.0.3** the app router performed its own history updates through a
reference to the *native* `pushState`/`replaceState` captured at module
evaluation time (`originalPushState` in `next/dist/client/components/app-router.js`),
so client-side navigations bypassed GTM's wrapper and no `gtm.historyChange`
event was pushed to the dataLayer.

`app/gtm-history-probe.jsx` emulates that GTM patch and counts the events.

## Run

```bash
npm install
npm run dev          # then open http://localhost:3000 and click the link
npm run check        # headless assertion (exit 0 = History Change fired)
npm run matrix       # 14.0.2 / 14.0.3 / 14.0.4 / canary
```

## Observed

| next    | gtm.historyChange after client-side nav |
| ------- | --------------------------------------- |
| 14.0.2  | 1 (PASS)                                |
| 14.0.3  | 0 (FAIL - the reported regression)      |
| 14.0.4  | 1 (PASS)                                |
| 14.2.4  | 1 (PASS)                                |
| canary  | 1 (PASS)                                |

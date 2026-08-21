# Repro: redirect() from an RSC to an intercepted route causes an infinite render/fetch loop

Upstream issue: https://github.com/vercel/next.js/issues/75762
(mirrors https://github.com/denexapp/redirect-from-rsc-to-intercepted-route-bug, pinned to a version that still fails)

## Steps

```bash
npm install
npm run dev            # http://localhost:3000
# click "Open console and terminal and click me" (-> /redirectToModal, which redirect()s to /photos/1)
```

`/photos/1` is intercepted by `app/@modal/(.)photos/[id]`. After the redirect the intercepted
page is re-rendered and re-fetched forever; the terminal and browser console fill with
`Rendering PhotoModal at ...` and the network tab shows one RSC request to `/photos/1` per render.

Automated check (dev server must already be running):

```bash
npx playwright install chromium
npm run check
```

## Observed

| next | result (30s after the click) |
| --- | --- |
| 15.1.6 | ~880 renders / RSC requests, still growing (infinite) |
| 15.5.23 | ~320 renders / RSC requests, still growing (infinite) |
| 16.3.1 / 16.3.1-canary.25 | 7 renders, then settles |

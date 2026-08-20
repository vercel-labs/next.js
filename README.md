# Repro: Next.js issue #68882 — module-level state from `app/layout.tsx` is lost on the first client-side `Link` navigation in `next dev`

Mirror/minimisation of https://stackblitz.com/edit/stackblitz-starters-xkmmhr
(the original StackBlitz Storyblok access token is dead, so this repro serves the
Storyblok CDN response from a local mock route at `app/api/sb/[...path]/route.ts`).

## Run

```bash
npm install
npm run dev            # dev server must be freshly (re)started
# open http://localhost:3000 and click "Go to test (next link)"
```

Automated check (needs `npx playwright install chromium`):

```bash
npm install && npx playwright install chromium
npm run dev            # in one terminal
npm run verify         # in another terminal, right after the dev server starts
```

## Observed (next 14.2.5, webpack dev)

Clicking `Go to test (next link)` on the **first** load after a dev-server restart:

* server log: `You can't use getStoryblokApi if you're not loading apiPlugin.`
  then `TypeError: Cannot read properties of null (reading 'get')` at `app/test/page.tsx`
* browser: dev overlay / uncaught `Cannot read properties of null (reading 'get')`
* reloading `/test` renders fine, and the error never returns until the dev server is restarted
* a plain `<a href="/test">` (full page load) always works

`/singleton` reproduces the same thing with zero third-party code: `initSingleton()`
runs at module scope in `app/layout.tsx`, and after the first `Link` navigation
`/singleton` renders `singleton value: null` (BROKEN); after a reload it renders
`initialised-by-layout` (OK).

## Version matrix (same repro, same steps)

| version | dev bundler | result |
| --- | --- | --- |
| next 14.0.3 | webpack | OK |
| next 14.2.5 | webpack | BROKEN |
| next 16.3.1 | `next dev --webpack` | BROKEN |
| next 16.3.1 | Turbopack (default) | OK |

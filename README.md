# Repro: issue #74922 — client-side navigation ignores fallback rewrite, renders catch-all page

Self-contained repair of https://github.com/klaasman/nextjs-rewrite-catchall-conflict
(the original relied on the external `httpstat.us` service; this version ships a local
proxy target on port 3001 so it works offline / in CI).

Setup: `pages/[...segments].tsx` with `getStaticPaths` + `fallback: false`,
`next.config.ts` `rewrites().fallback` proxying `/:path*` to the external host,
and a (now optional) `src/middleware.ts`.

## Run

```bash
npm install
node proxy-target.js &          # local "external host" on :3001, echoes the requested status code
npm run dev                     # or: npm run build && npm start
```

Then open http://localhost:3000 and click the `/200` link (client-side navigation).

## Expected vs actual

* Hard navigation `curl localhost:3000/200` -> `PROXIED HOST RESPONSE 200 for /200` (rewrite honored).
* Client-side navigation to `/200` -> renders the local catch-all page `[...segments]` with empty
  props instead of following the fallback rewrite.
* Control: `/400` (proxy target returns 400) correctly falls back to a hard navigation and shows
  the proxied response.

The `/_next/data/<buildId>/200.json?segments=200` request is proxied to the external host and
returns `200 text/plain`; Next.js adds `x-nextjs-matched-path: /[...segments]` to that response,
so the client router treats it as a match for the catch-all page and renders it client-side.

Optional automated check (needs `npm i playwright`):

```bash
node playwright-check.mjs http://localhost:3000 out
```

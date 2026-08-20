# Repro: vercel/next.js#62451 — searchParams changes don't re-render a non-active parallel-route slot

Minimal reproduction of https://github.com/vercel/next.js/issues/62451 on Next.js 16.3.1
(also reproduces on the reporter's original 14.1.0 repro).

Structure:

- `app/layout.tsx` renders two slots: `@list` (master) and `@detail` (detail)
- `app/@list/page.tsx` is a server component that reads `searchParams.page`; `app/@list/default.tsx` re-exports it
- `app/@detail/[id]/page.tsx` is the detail slot, `app/@detail/default.tsx` renders `null`

## Steps

```bash
npm install
npm run dev        # or: npm run build && npm start
```

1. Open `/` — `@list` shows "server-rendered page: 1"
2. Click "next page" (`router.replace('?page=2')`) — `@list` correctly re-renders as page 2
3. Click "open detail" (navigates to `/abc?page=2`) — `@detail` slot mounts, `@list` falls back to `default.tsx`
4. Click "next page" again (`/abc?page=3`, `/abc?page=4`)

## Expected

`@list` re-renders with the new `page` search param (like in step 2).

## Actual

The URL and the `@detail` slot update, and the server even re-renders `@list` with the new
param (see `[server] @list rendered with page = 3` in the dev log), but the rendered
`@list` slot stays frozen at "server-rendered page: 2". Only a hard reload fixes it.

## Automated check

```bash
npm run dev
node test.mjs   # needs `npm i playwright` + `npx playwright install chromium-headless-shell`
```

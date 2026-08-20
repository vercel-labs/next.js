# Reproduction harness for vercel/next.js#56811

"Page is rerendered on the server, when calling a server action after navigating back via browser button"

## What this app contains

- `app/layout.tsx` / `app/page.tsx` / `app/rq/page.tsx` log every server render (`[server] ROOT LAYOUT RENDERED`, ...).
- `app/actions.ts` — a Server Action that logs start/end.
- `app/rq/rq-client.tsx` — faithful port of the reporter's setup: `@tanstack/react-query` `useInfiniteQuery`
  whose `queryFn` is the Server Action, driven by `react-intersection-observer` and the reporter's effect
  (`if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()`).
- `app/counter.tsx` / `app/infinite.tsx` — react-query-free variants (action from a click and from `useEffect`).
- `app/item/[id]/page.tsx` — dynamic route to navigate to before pressing browser Back.

## Run

```bash
npm install
npm run dev            # dev server on :3000  (or: npm run build && npm start)
node scripts/back-nav-server-action.mjs        # /rq: scroll -> nav to /item/1 -> browser Back -> scroll
node scripts/plain-action-after-back.mjs       # /  : action click -> nav -> Back -> action click
```

The scripts print `pages=N fetchStatus=... isFetching=...` after each scroll step; watch the server console for
`ROOT LAYOUT RENDERED` lines appearing after the Back navigation / Server Action.

## Result on 16.3.1-canary.25 (Node 24, dev and `next start`)

Not reproduced: after browser Back the infinite query keeps resolving (`pages` grows 15 -> 20,
`fetchStatus=idle`), Server Actions resolve, and no `ROOT LAYOUT RENDERED` line is emitted after the Back
navigation or after any Server Action. The same harness (JS variant) on `next@13.5.4` also did not hang locally.

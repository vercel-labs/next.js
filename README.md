# Repro: client components wrapped in React.memo remount on router.refresh() (vercel/next.js#73507)

    npm install
    npm run dev   # or: npm run build && npm run start
    # open http://localhost:3000 and click "router.refresh()"

Page renders three client components from a server component:
`Normal`, `Memo` (default export wrapped in `React.memo`), `IndirectMemo`
(plain component rendering a memo-ed child). Each logs MOUNT/UNMOUNT and
ticks a counter every 500ms (also mirrored into the `<pre>` on the page).

Observed: after `router.refresh()` only `memo` logs UNMOUNT/MOUNT and its
counter resets to 0, while `normal` and `indirect-memo` keep their state.

Verified with next 15.0.4 (dev) and 16.3.1-canary.25 (dev and next start).

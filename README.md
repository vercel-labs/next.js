# Reproduction: server action lost after a same-path `<Link>` navigation (#97438)

Next.js **16.2.9** (App Router). A `<Link href="/">` on the page it already points at fires a
server action from `onClick` inside `startTransition`. Clicking several such links in quick
succession makes some actions never run: no `POST` is sent and `await markRead(id)` never settles.

Root cause (`client/components/app-router-instance.js`): when `ACTION_NAVIGATE` preempts a pending
`ACTION_SERVER_ACTION`, the pending node is marked `discarded` and replaced as `pending`, but
`actionQueue.last` still points at the discarded node. The next server action is linked in via
`actionQueue.last.next`, i.e. behind a node that is no longer in the chain, so it never runs.

## Run

```bash
npm install
npx playwright install chromium
npm test        # starts `next dev` on :3000 and drives Chromium
```

The Playwright test clicks 4 same-path links 200 ms apart with 400 ms emulated network latency
(so the same-path navigation is still pending in the queue when the next click dispatches its
action). Tune with `LATENCY` / `GAP` env vars.

## Observed on next@16.2.9 (FAIL)

```
calling action 1
calling action 2
action settled 1 {"ok":true}
calling action 3
calling action 4
action settled 3 {"ok":true}
--- POST requests: 2, settled actions: 2
```

`next dev` output only shows `server action START/DONE` for 1 and 3.

## next@16.3.1 (PASS)

4 POSTs, 4 settled actions — canary/16.3.x added `if (actionQueue.last === actionQueue.pending) actionQueue.last = newAction`
plus a `pending === settledAction` guard in `runRemainingActions`.

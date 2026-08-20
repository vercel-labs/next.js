# Repro: vercel/next.js#63949 — `router.push()` is delayed until a Server Action finishes

Minimal reproduction of https://github.com/vercel/next.js/issues/63949 on **next@16.3.1** (dev and `next start`).

`app/Client.js` has three buttons; the Server Action in `app/actions.js` sleeps 4s.

| button | behavior |
| --- | --- |
| `router.push('/target')` then `await slowAction()` | navigation is **blocked ~4s** until the action resolves |
| `slowAction()` (not awaited) then `router.push('/target')` | navigates immediately (~140ms) |
| `router.push('/target')` only | navigates immediately (~150ms) |

## Run

```bash
npm install
npm run dev            # http://localhost:3000
# or: npm run build && npm run start
```

Click "router.push then server action" and watch the URL/page: it stays on `/` for the entire
duration of the Server Action.

Automated measurement (needs `npm i -D playwright && npx playwright install chromium`):

```bash
node measure.mjs          # dev server on :3000
PORT=3001 node measure.mjs  # prod server started with `next start -p 3001`
```

Measured output on next@16.3.1 (fresh browser context per scenario):

```
dev :  action-then-push 141ms | push-then-action 4138ms | push-only 152ms
prod:  action-then-push 143ms | push-then-action 4137ms | push-only 118ms
```

# Repro: vercel/next.js#58386 — "Maximum call stack size exceeded" not surfaced in App Router

Minimal reproduction of an infinitely self-recursive component in the App Router vs the Pages Router.

- `app/page.tsx` -> `/` (App Router)
- `pages/pages-recursive.tsx` -> `/pages-recursive` (Pages Router)

## Run

```bash
npm install
npm run dev
# App Router: hangs, response never completes
curl -m 60 -o /dev/null -w '%{http_code} %{time_total}\n' http://localhost:3000/
# Pages Router: 500 + RangeError overlay within ~0.4s
curl -m 60 -o /dev/null -w '%{http_code} %{time_total}\n' http://localhost:3000/pages-recursive
```

## Observed (next@16.3.1-canary.25, Node 24)

App Router `/`: the request never finishes (still open after 3 minutes). The browser shows the
generic "This page couldn't load / A server error occurred. Reload to try again. ERROR <digest>"
screen — no `RangeError: Maximum call stack size exceeded` anywhere in the UI. The dev server log
shows the RangeError plus internal failures while handling it:

```
⨯ RangeError: Maximum call stack size exceeded
TypeError: chunk.reason.error is not a function
⨯ uncaughtException: TypeError: chunk.reason.error is not a function
⨯ TypeError: frame.join is not a function
 GET / 500 in 3.0min (next.js: 1.1ms, application-code: 3.0min)
```

Pages Router `/pages-recursive`: `500` in ~390ms, dev overlay and `pageerror`
`RangeError: Maximum call stack size exceeded`.

On next@14.0.2 (the version in the reporter's repo) the App Router request hangs with **no** error
logged at all.

## Secondary claim from the issue (also reproduced)

`kill -9` on the `next dev` parent process leaves the child `next-server` process alive and still
serving port 3000, so restarting reports the port as occupied.

# Reproduction for vercel/next.js#77568 — infinite "failed to forward action response" loop

Minimal reproduction of the self-sustaining server action forwarding loop reported in
https://github.com/vercel/next.js/issues/77568.

## Setup

```bash
npm install
```

## Reproduce (dev)

```bash
npm run dev          # terminal 1
npm run loop         # terminal 2
```

## Reproduce (production)

```bash
npm run build && npm start   # terminal 1
npm run loop                 # terminal 2
```

## What happens

`npm run loop` sends a single `POST /foo` with a `next-action` header whose action id
belongs to `app/[locale]/page.js` (this is what a client does when a fetch action is
posted to a route the action is not associated with).

The `middleware.js` rewrite (next-intl style locale rewrite) means the action is not
found in the current worker, so `handleAction` forwards the request to the worker
pathname from the server actions manifest — the *literal* `/[locale]` path with
unresolved dynamic segments. That forwarded request hits middleware again, the action
is again not found for that page, and it is forwarded again, forever:

```
[middleware] POST /[locale] next-action=<id> x-action-forwarded=1
[middleware] POST /[locale] next-action=<id> x-action-forwarded=1
... thousands of times ...
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

The loop continues after the client disconnects and only ends when the process crashes
or is restarted, matching the reports of servers needing cron-based restarts.

## Observed

* next 15.4.6 (`next dev` and `next start`): thousands of forwarded `POST /[locale]`
  requests per single client request, ending in a V8 heap OOM crash.
* next 16.3.1-canary.26: fixed — the request returns `404` with
  `x-nextjs-action-not-found: 1` and exactly one forward, no loop.
  (`handleAction` now skips forwarding when `x-action-forwarded` is already set.)

To check canary: `npm install next@canary react@19.2.0 react-dom@19.2.0` and rerun.

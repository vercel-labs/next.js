# Reproduction: next.js#93905 — dev-mode hydration silently dies after browser Back (HTTP-cache restore)

Minimal repro of https://github.com/vercel/next.js/issues/93905 on **Next.js 16.2.6** (`next dev` only).

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
node test.mjs hard     # terminal 2 (automated: nav via <a>, then history back)
```

Manual: open http://localhost:3000, click "hard link to /other" (a full-document
navigation), then press the browser Back button and click the counter button.

## Observed (Next.js 16.2.6, `next dev`)

```
[initial-home]     hydrated=yes clickIncrements=true
[on-other]         hydrated=yes clickIncrements=true
[after-back-home]  hydrated=no  clickIncrements=false
errors: []
```

The restored page is visually correct, no console error / warning / stack trace is
emitted, but React never hydrates: `useEffect` never runs and onClick handlers are dead.

## Expected

After Back, the page hydrates and remains interactive.

## Scope observed here

- `next dev` + document (MPA) navigation + Back: **broken** (dev responses are `Cache-Control: no-cache`, so the browser restores the HTML + inline RSC payload from HTTP cache).
- `next dev` + soft `<Link>` navigation + Back: works (`node test.mjs soft`).
- `next build` + `next start`: works.
- `next@16.3.1-canary.26`: fixed (matches #92892 / #93486).

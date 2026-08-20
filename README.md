# Reproduction attempt for vercel/next.js#47351 — a11y issues in the dev error overlay

The issue had no reproduction ("NA"). This is a minimal harness that opens the dev error
overlay and runs axe-core against it.

## Run

```bash
npm install
npx playwright install chromium
npm run dev              # next dev -p 3111
npm run axe              # in a second shell
```

Routes: `/` (three unhandled runtime errors -> "1/3" pagination) and `/hydration`
(hydration mismatch -> docs link + Component Stack section).

`axe-check.mjs` does three things per route:
1. axe-core 4.13 scan of the page exactly as shipped;
2. a manual accessible-name / heading-order audit of the overlay shadow tree;
3. an axe scan after re-parenting `<nextjs-portal>` out of its `<script>` wrapper.

## Result on next@16.3.1-canary.25 (Turbopack, Node 24)

- The three violations from the report are gone: overlay pagination buttons carry
  `aria-label` on their icon (`aria-label="previous"` / `"next"`), the copy/collapse/editor
  buttons have `aria-label` or `title`, the `<h5>Component Stack</h5>` heading and the
  `<h1>Unhandled Runtime Error</h1>` heading no longer exist (no headings at all in the
  dialog), and `color-contrast` passes.
- Only violation reported for the page is `document-title` — that comes from this repro app,
  not from Next.js.
- Side observation: `<nextjs-portal>` is mounted as a child of
  `<script data-nextjs-dev-overlay="true">`, so axe-core skips almost the entire overlay
  subtree (script subtrees are excluded). Automated scans of the overlay are effectively
  no-ops today; step 3 above works around it and still finds no overlay violations.

## Historical baseline

`baseline-next-13/` reproduces the exact violations from the report on next@13.2.4.

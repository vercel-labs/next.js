# Repro: nextjs.org docs App/Pages router switcher does not navigate (issue #72829)

Docs-site behavior reproduction (no Next.js app needed). A Playwright script opens a docs page,
clicks the sidebar "Open directory select" switcher, chooses "Using Pages Router", and reports the
resulting URL / heading.

## Run

```bash
npm install
npx playwright install chromium
# archived v13 docs (URL from the issue) -> BUG: stays on the App Router page
START_URL=https://nextjs.org/docs/13/app/api-reference/file-conventions/route-segment-config TAG=v13 npm run repro
# latest docs -> navigates to /docs/pages/api-reference/file-conventions
TAG=latest npm run repro
```

## Observed (2026-05)

| start URL | after choosing "Using Pages Router" |
| --- | --- |
| `/docs/13/app/api-reference/file-conventions/route-segment-config` | URL unchanged, `h1` still "Route Segment Config"; only the switcher label + sidebar flip to Pages Router |
| `/docs/app/api-reference/file-conventions/route-segment-config` | `/docs/pages/api-reference/file-conventions` |
| `/docs/app/api-reference/directives/use-cache` | `/docs/pages/api-reference` |

So the reported behavior still reproduces on the archived versioned docs (`/docs/13/...`); on the
latest docs the switcher falls back to the nearest existing Pages Router ancestor instead of an
equivalent page.

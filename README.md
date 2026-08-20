# Repro: issue #74756 — catch-all `[[...slug]]` route ships all `next/dynamic` components in the eager client bundle

Minimal reproduction (Next.js canary, App Router). A server-component module
(`app/resolveComponent.tsx`) maps names to `next/dynamic` imports of two client
components. Two prerendered routes of one `[[...slug]]` page use one component each.

`scripts/check.mjs` fetches a page from the running production server, downloads
every `<script src>` in the HTML and reports which component markers are present
in the eagerly loaded JS.

## Run

```bash
npm install
npx next build --webpack && npx next start -p 3000 &   # or: npx next build (Turbopack)
node scripts/check.mjs /about
node scripts/check.mjs /contact
node scripts/check.mjs /workaround/about   # dynamic() inside a "use client" module
```

## Observed on next@16.3.1-canary.25

| route | bundler | UNIQUE_MARKER_CAROUSEL | UNIQUE_MARKER_ACCORDION |
| --- | --- | --- | --- |
| /about | webpack | PRESENT | PRESENT |
| /contact | webpack | PRESENT | PRESENT |
| /about | Turbopack | PRESENT | PRESENT |
| /contact | Turbopack | PRESENT | PRESENT |
| /workaround/about | webpack & Turbopack | absent | absent |

Both client components land in the eagerly loaded page chunk on both bundlers;
`next/dynamic` in a Server Component module does not create a lazy chunk.
Moving the `dynamic()` map into a `"use client"` module (`app/ClientResolved.tsx`,
route `/workaround/...`) restores lazy loading.

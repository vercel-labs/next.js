# Repro: issue #96855 — scroll not reset when a parallel slot renders only a `position: fixed` element

Mirror of https://github.com/Pilaton/next-fixed-slot-scroll-repro (next 16.3.0), plus
`scroll-check.mjs`, a Playwright script that measures `window.scrollY` after client navigations.

## Run

```bash
pnpm install
pnpm dev            # http://localhost:3000
npm i playwright && npx playwright install chromium
node scroll-check.mjs   # BASE=http://localhost:3000 by default
```

The script scrolls to y=2000 on `/`, clicks the `<Link>` to `/about` (and back) four times,
and prints `window.scrollY` after each navigation.

## Observed (next 16.3.0, `next dev` and `next start`)

```
default config                       -> navigations that reset scroll to 0: 0/4  (stays at 2000)
experimental.appNewScrollHandler:false -> navigations that reset scroll to 0: 4/4
```

Uncomment `appNewScrollHandler: false` in `next.config.mjs` to see the pre-16.3.0 behavior.

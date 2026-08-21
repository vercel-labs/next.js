# Repro: vercel/next.js#86035 — intercepting-route modal shows stale background

Minimal copy of the reporter's app (https://github.com/smitkhanparaZuru/parallel-old, MIT-less demo)
pinned to `next@15` (reporter used 15.1.4; confirmed on 15.5.23).

## Run

```bash
npm install
npm run build && npm start          # local: does NOT reproduce
# deploy to Vercel, then run against a FRESH (cold-cache) deployment URL:
npm i playwright && npx playwright install chromium-headless-shell
BASE=https://<fresh-deployment-url> node repro-steps.mjs
```

`repro-steps.mjs` walks the reporter's 11 steps and prints, for each step, the URL, the
background page (`children` slot) and the modal page (`@modal` slot).

## Observed (next@15.5.23, Vercel, first visit to a fresh deployment)

```
7  discover     | url=/dark/discover | background=Discover Page | modal=none
8  profile      | url=/dark/profile  | background=Discover Page | modal=Profile Modal Page
9  ->setting    | url=/dark/setting  | background=Discover Page | modal=Setting Modal Page
10 ->changelog  | url=/dark/changelog| background=Discover Page | modal=Changelog Modal Page
11 ->profile    | url=/dark/profile  | background=Chat Page     | modal=Profile Modal Page   <-- BUG
```

Expected at step 11: `background=Discover Page`.

## Notes

- Only reproduces on Vercel and only on the first run against a freshly deployed URL
  (cold CDN/prefetch cache); repeated runs against a warm deployment pass.
- `next start` locally (15.1.4 and 15.5.23) does not reproduce.
- Not reproducible on `next@16.3.1` (cold, freshly deployed) with the same script.

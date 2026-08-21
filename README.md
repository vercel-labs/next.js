# Repro: vercel/next.js#84017 — next-config-js docs use CommonJS, no TS switcher, no highlight

Documentation-content issue; there is no runtime bug. The "reproduction" is a deterministic
audit of the docs source in `vercel/next.js@canary` plus the published page.

## Run

```bash
./audit.sh
```

The script sparse-clones `vercel/next.js` docs and prints, per page under
`docs/01-app/03-api-reference/05-config/01-next-config-js/`, the number of
`module.exports` occurrences, `switcher` (js/ts tabs) occurrences and
`highlight={...}` occurrences.

## Expected vs actual (canary @ 14a69ef78b94c9bdb68b2f1d5d1a55599ff8022c)

- 67 / 71 pages contain `module.exports` (CommonJS) examples, tagged `filename="next.config.js"`.
- 41 of those have no `js`/`ts` switcher, so there is no `next.config.ts` variant.
- Only 3 pages use `highlight={...}` on the relevant config line.
- `allowedDevOrigins.mdx` (page cited in the issue) has cjs=1, switcher=0, highlight=0; the
  published page https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  serves the same CommonJS-only snippet.

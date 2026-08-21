# Repro: Turbopack serves stale (one-revision-behind) CSS after saving a CSS file

Issue: https://github.com/vercel/next.js/issues/87884 (mechanism analysis: https://github.com/vercel/next.js/issues/93052)

## Run

```bash
npm install
npm run dev            # Turbopack (default)
# in another shell:
npm run check          # flips .hero border-radius and reads the served CSS chunk
```

Control run with webpack:

```bash
npm run dev:webpack
URL=http://localhost:3000 npm run check
```

## Observed (next 16.3.1 and 16.1.1, @tailwindcss/postcss 4.2.2, Turbopack)

```
[1/4] saved 29px -> served 28px MISS (stale)
[2/4] saved 30px -> served 29px MISS (stale)
[3/4] saved 31px -> served 30px MISS (stale)
[4/4] saved 32px -> served 31px MISS (stale)
misses: 4/4
```

The served CSS chunk is permanently one save behind (still stale after a 10s poll,
and after full page reloads). In a browser the body/element styling therefore shows
the previous edit, matching the video in #87884.

`next dev --webpack` on the same project: `misses: 0/4`.

## Notes

- Requires a PostCSS plugin that reports file dependencies. `@tailwindcss/postcss@4.2.2`
  (what `create-next-app` installed at the time of the report) triggers it; the versions
  are pinned here on purpose.
- With `@tailwindcss/postcss@4.3.3` the same project does **not** reproduce, i.e. recent
  Tailwind releases mask the underlying Turbopack PostCSS invalidation race.
- A plain CSS project without PostCSS does not reproduce.

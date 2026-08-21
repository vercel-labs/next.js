# Repro: app/not-found CSS module preloaded on unrelated routes (next 16.1.6)

Mirror of https://github.com/t18n/next-js-app-router-css-bundle-repro with one
fix so `next build` passes (`variant` prop on a plain `<a>` failed typecheck in
`src/app/dashboard/users/page.tsx`).

`Button.module.css` is only imported by `src/components/Button.tsx`, used by
`app/page.tsx` and `app/not-found.tsx`. It must not be shipped for `/dashboard`.

## Run

```bash
pnpm install --config.strict-dep-builds=false
./verify.sh          # build + start + inspect /dashboard HTML
# or: npx next experimental-analyze  (see .next/diagnostics/analyze/data/dashboard/analyze.data)
```

## Observed (next 16.1.6, Turbopack and `--webpack`)

`/dashboard` HTML contains:

```html
<link rel="stylesheet" href="/_next/static/chunks/3a45775c160471ae.css" data-precedence="next"/>  <!-- layout + globals -->
<link rel="stylesheet" href="/_next/static/chunks/861641d2498935ca.css" data-precedence="next"/>  <!-- dashboard page -->
<link rel="preload"    href="/_next/static/chunks/394d7cf256d9e5b1.css" as="style"/>              <!-- home + not-found + Button.module.css -->
```

The preloaded chunk is downloaded by the browser on `/dashboard` but is not
inserted as a stylesheet, so it is wasted bytes rather than render-blocking.
`next experimental-analyze` also attributes `Button.module.css` / `Button.tsx`
to `/dashboard` and `/dashboard/users`.

Replacing `app/not-found.tsx` with a plain `<div>` (no `Button`) removes the
preload from `/dashboard`, so the `not-found` convention tree is the vector.

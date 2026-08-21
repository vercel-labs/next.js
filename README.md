# Repro: Turbopack `.avif` static import — "AVIF image not supported"

Issue: https://github.com/vercel/next.js/issues/86392

```
npm install
npx next build            # Turbopack: warning + fallback 100x100 dimensions
npx next build --webpack  # webpack: no warning, correct 64x32 dimensions
```

`app/a.avif` is a 64x32 AVIF image statically imported in `app/page.tsx`.

Turbopack build output:

```
Turbopack build encountered 1 warning:
./app/a.avif
Warning: AVIF image not supported
This version of Turbopack does not support AVIF images, will emit without optimization or encoding
```

and `.next/server/app/index.html` contains `width="100" height="100"` (fallback), while the
webpack build contains the real `width="64" height="32"`.

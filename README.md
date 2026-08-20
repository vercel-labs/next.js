# Repro: vercel/next.js#47097

`@next/next/no-img-element` warns inside an `ImageResponse` (`next/og`) JSX in an App Router
route handler, where `next/image` cannot be used at all.

```bash
pnpm install
pnpm exec eslint .
```

Expected: no `no-img-element` warning for JSX passed to `ImageResponse`.
Actual: warning is reported on `app/api/og/route.tsx`.

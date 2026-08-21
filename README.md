# Verification harness for vercel/next.js#80658 — metadata duplication with next-intl locale redirects

Minimal app mirroring the ingredients of the report (next-intl `createMiddleware`, `localePrefix: 'always'`,
root `app/layout.tsx` + `app/[locale]/layout.tsx`, async `generateMetadata` that awaits `params`/`searchParams`
and `getTranslations`, `loading.tsx`, `error.tsx`) plus a Playwright script that counts
`head title` / `meta[name=description]` / `meta[property=og:title]` after each client navigation.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start &        # or: npm run dev
npm run check
```

Navigations exercised: `?q=` change via `next/navigation` `router.replace`, locale switch via next-intl
`useRouter().replace(pathname, { locale })`, raw `router.replace('/')` (hits the next-intl middleware 307
redirect to `/en`), and back/forward.

## Result

No duplication observed on any tested version (dev, `next start`, and a Vercel deployment):
`next@15.3.2` (version in the report), `15.3.3`, `15.4.5` (version in the follow-up comment),
`15.5.23`, `16.3.1` — always exactly one `<title>` and one `<meta name="description">`.

The reporter's app (github.com/jjtsou/job-board, pinned back to next@15.3.2) was also run locally with its
external jobs API stubbed (the upstream Azure API answers 403), exercising search submit
(`router.push('?q=...')`), the `LanguageSwitcher` (`router.replace(path, { locale })`) and back navigation:
still one `<title>` / one description in `<head>` at every step.

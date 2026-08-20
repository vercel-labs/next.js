# Reproduction — vercel/next.js#71757

Dynamic route params are replaced by the URL-encoded segment placeholder
(`%5Bdoesnt-work%5D`) for on-demand (non-pregenerated) paths of a
`force-static` + `dynamicParams` route, **only when deployed to Vercel**.

Route: `app/blog/[doesnt-work]/page.js` (`export const dynamic = "force-static"`,
`generateStaticParams` returns only `pregenerated`).

## Run

    npm install
    npm run build && npm start   # ✅ /blog/some-slug -> {"doesnt-work":"some-slug"}

Then deploy the same directory to Vercel:

    vercel deploy --prod
    curl https://<deployment>/blog/some-slug

## Observed

| Environment | `/blog/some-slug` |
| --- | --- |
| `next dev` / `next start` (Next 15.5.9) | `{"doesnt-work":"some-slug"}` ✅ |
| Vercel deployment (Next 15.5.9) | `{"doesnt-work":"%5Bdoesnt-work%5D"}` ❌ |
| Vercel deployment (Next 16.3.1) | `{"doesnt-work":"some-slug"}` ✅ |
| `/blog/pregenerated` (any env) | `{"doesnt-work":"pregenerated"}` ✅ |

So the bug is still present on the latest 15.x line (15.5.9) when built on Vercel,
and appears fixed on Next 16.3.1.

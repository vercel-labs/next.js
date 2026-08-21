# Repro for vercel/next.js#76323

`generateImageMetadata` disables the build-time prerendering that `generateStaticParams`
gives an `opengraph-image.tsx` route.

## Cases

| route | where `generateStaticParams` lives | `generateImageMetadata` | build output marker | prerendered at build? |
| --- | --- | --- | --- | --- |
| `/a/[slug]` | page only | no  | `ƒ /a/[slug]/opengraph-image` | no |
| `/b/[slug]` | page only | yes | `● /b/[slug]/opengraph-image/[__metadata_id__]` | no |
| `/c/[slug]` | `opengraph-image.tsx` | no  | `● /c/[slug]/opengraph-image` (+ `/c/one`, `/c/two`) | **yes** |
| `/d/[slug]` | `opengraph-image.tsx` | yes | `● /d/[slug]/opengraph-image/[__metadata_id__]` (no concrete paths) | no |

## Run

```bash
npm install
npm run verify
```

Expected/observed on Next.js 16.3.1 and 15.2.0: the only `.body` files written by the build are

```
.next/server/app/c/one/opengraph-image.body
.next/server/app/c/two/opengraph-image.body
```

`/d` (the same file plus `generateImageMetadata`) writes nothing, even though the build table
labels it `●` (SSG). With `next start`, `/c/one/opengraph-image` answers with
`x-nextjs-cache: HIT` from the build output, while `/d/one/opengraph-image/small` is rendered on
demand on first request (and only then cached).

# next#63210 — "Couldn't find all resumable slots by key/index during replaying."

Minimal, deployment-free reproduction of the PPR / Cache Components resume
failure reported in https://github.com/vercel/next.js/issues/63210.

## Run

```bash
./repro.sh            # npm install + next build + next start + one request
# or
npm install && npm run build && npm start   # then GET http://localhost:3000/unstable-keys
```

## What happens

`app/unstable-keys/page.tsx` renders three postponed `<Suspense>` boundaries whose
`key`s are not stable between the build-time prerender and the runtime resume
(here: derived from `process.env.NEXT_PHASE`, which is `phase-production-build`
during `next build` and undefined at runtime — the real-world equivalents are
random/`Date.now()`/locale/user-agent derived keys).

When the prerendered shell is resumed, React cannot match the postponed slots:

```
⨯ Error: Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.
    at ignore-listed frames {
  digest: '469890639'
}
```

The HTML response only ever contains the three Suspense fallbacks
(`<li>loading 0..2</li>`); the dynamic children are never streamed, so the
document is abandoned and React falls back to client rendering — the reported
"not found" / broken page after a reload on Vercel.

Reproduced with `next@16.2.4` and `next@16.3.1` (Node 24, `next start`,
`cacheComponents: true`).

## Bonus: the streaming-metadata + bot variant (Vercel/minimal mode)

`app/blog/[slug]/page.tsx` has a dynamic `generateMetadata`. On `next@16.2.4`,
replaying the build-time postponed state the way the platform does in minimal
mode:

```bash
NEXT_PRIVATE_MINIMAL_MODE=1 npx next start &
node -e "const fs=require('fs');fs.writeFileSync('/tmp/p.txt',JSON.parse(fs.readFileSync('.next/server/app/blog/how-tailwind-grew-on-me.meta','utf8')).postponed)"
curl -X POST http://localhost:3000/blog/how-tailwind-grew-on-me \
  -H 'x-matched-path: /blog/[slug]' -H 'next-resume: 1' \
  -H 'user-agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' \
  --data-binary @/tmp/p.txt
```

logs the sibling mismatch (Googlebot resumes with `serveStreamingMetadata: false`):

```
⨯ Error: Expected the resume to render <div> in this slot but instead it rendered <__next_metadata_boundary__>. The tree doesn't match so React will fallback to client rendering.
```

This second variant no longer errors on `next@16.3.1`.

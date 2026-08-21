# Repro attempt: `opengraph-image` reading local files with `process.cwd()` (issue #77498)

Issue: https://github.com/vercel/next.js/issues/77498

`app/explore/[slug]/opengraph-image.tsx` is a **dynamic** OG image route that loads
`assets/fonts/Inter-Bold.ttf` and `public/images/og/logo.png` with
`readFile(join(process.cwd(), ...))`, exactly like the report. Failures are returned as
`text/plain` with the stack, so the error is visible in the HTTP response.
`GET /debug` prints `process.cwd()` and the directory listings seen at runtime.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000/explore/foo/opengraph-image  -> 200 image/png
npm run build && npm start   # http://localhost:3001/explore/foo/opengraph-image  -> 200 image/png
```

Deploy to Vercel and request `/explore/foo/opengraph-image` and `/debug`.

## Result on Next.js 15.5.23 (Vercel, Node runtime)

Both requests succeed. `/debug` reports `cwd=/var/task` and both `assets/fonts` and
`public/images/og` are present inside the function, because next-file-tracing records them:

```
.next/server/app/explore/[slug]/opengraph-image/route.js.nft.json
  -> ../../../../../../assets/fonts/Inter-Bold.ttf
  -> ../../../../../../public/images/og/logo.png
```

So the ENOENT from the report does not reproduce with a plain single-package app on a
current Next.js version. Reported failing setups involve monorepos / non statically
analyzable paths, where the file never enters the trace; the documented workaround is
`outputFileTracingIncludes`.

# Repro: `/` route compiled with the wrong layout when the project root is `/app` and a route segment is named `app`

Issue: https://github.com/vercel/next.js/issues/68690

## What actually happens

The failure is **not Docker specific and not `output: "standalone"` specific**. It happens during
`next build` whenever:

- the project root directory is `/app` (the `WORKDIR /app` used by the official Next.js Dockerfile), **and**
- the App Router has a route segment named `app` (`app/app/page.tsx` → route `/app`).

Then the `/` route is built from `app/app/{layout,page}.tsx` instead of `app/{layout,page}.tsx`.
The prerendered `/` HTML therefore has no `<html>`/`<body>` (the root layout is skipped), so the
browser shows a blank page and React throws:

```
Minified React error #418 / #423
HierarchyRequestError: Failed to execute 'appendChild' on 'Node': Only one element on document allowed.
NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
```

## Run it (no Docker needed)

Requires root, Node >= 18 (the script writes to `/app`):

```bash
bash ./reproduce.sh
```

Expected output (bug): `FAIL (bug reproduced): / is missing the root layout <html> element.`
The script prints the first bytes of `/app/.next/server/app/index.html`, which start with a
`<script>`/`<meta>` instead of `<!DOCTYPE html><html lang="en">`.

### Controls (both pass, i.e. no bug)

```bash
TARGET=/tmp/not-app bash ./reproduce.sh   # same code, project root is not /app  -> PASS
# staying in /app but renaming app/app -> app/a                                  -> PASS
```

## Docker variant (as originally reported)

```bash
docker build -t nextjs-docker .
docker run -p 3000:3000 nextjs-docker
# open http://localhost:3000 -> blank page + the React errors above
```

## Versions checked

| next | `/` prerender contains root layout `<html>`? |
| --- | --- |
| 14.2.5 (as reported) | no — broken |
| 15.5.23 (pinned here) | no — broken |
| 16.3.1 | yes — fixed |

Note: with `output: "standalone"` and root `/app`, `.next/standalone/` additionally contains a
stray copy of the source `app/layout.tsx` and `app/page.tsx` at its root (the traced source files
land one directory too high), which is another symptom of the same path handling problem.

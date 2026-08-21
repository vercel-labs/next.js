# Repro: [Pages] Turbopack dev errors (500) on 404 when a folder named `App` exists

Upstream issue: https://github.com/vercel/next.js/issues/81271

A Pages Router app with a sibling directory named `App` (capital A, no `page`/`layout`
inside). On a **case-insensitive filesystem** (macOS APFS, Windows NTFS) Next.js detects
`App` as the App Router directory, and `next dev --turbopack` then answers every unmatched
route with HTTP 500 instead of the Pages Router 404 page:

```
⨯ Error [PageNotFoundError]: Cannot find module for page: route not found /_not-found/page
  code: 'ENOENT'
GET /nonexistent 500
```

`next dev` (webpack) on the same tree returns 404 correctly.

## Run (macOS / Windows)

```bash
npm install
npm run dev            # next dev --turbopack
curl -o /dev/null -w '%{http_code}\n' http://localhost:3000/nonexistent   # => 500 (expected 404)
npm run dev:webpack    # control: same request => 404
```

## Run on Linux

Linux is case-sensitive, so `App` != `app` and the bug does not trigger. Use the FUSE
harness which mounts this directory case-insensitively:

```bash
sudo apt-get install -y fuse3 libfuse3-dev gcc pkg-config
./linux-case-insensitive-harness/run.sh
curl -o /dev/null -w '%{http_code}\n' http://localhost:3005/nonexistent   # => 500
```

Verified failing with next@15.4.0-canary.113 and next@16.3.1-canary.26.
Removing/renaming the `App` folder, or using webpack dev, returns 404 as expected.

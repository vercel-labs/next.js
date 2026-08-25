# Reproduction attempt for vercel/next.js#97894

Dev server (Turbopack): child routes below a dynamic segment inside route groups
intermittently 404 for an entire `next dev` session.

The original report has no public reproduction. This repo is a synthetic app matching
the reported route shape plus a boot-loop harness that classifies every boot
automatically, so the race can be hunted on other machines (notably Windows).

## Route shape

```
app/(sv)/(public)/kommun/[slug]/page.tsx          dynamicParams=false + generateStaticParams
app/(sv)/(public)/kommun/[slug]/byta/page.tsx
app/(sv)/(public)/kommun/[slug]/feed.xml/route.ts
app/(sv)/(public)/vardcentral/[slug]/{page,ring/page}.tsx
app/(en)/en/vardcentral/[slug]/{page,ring/page}.tsx
app/plain/[slug]/ring/page.tsx                    control, outside any route group
app/(sv)/(public)/filler-*/page.tsx               module-graph filler
```

## Run

```bash
npm install
node gen.js            # regenerate app/, FILLER=400 for a heavier module graph
./loop.sh 14 ./logs    # 14 fresh-cache boots; prints HTTP status per boot
```

Each boot deletes `.next`, waits for "Ready", then requests
`/vardcentral/slug-1/ring`, `/en/vardcentral/slug-1/ring`, `/plain/slug-1/ring`
and `/kommun/slug-2/feed.xml`. An affected boot returns `404` with no
`○ Compiling /vardcentral/[slug]/ring` line in the boot log.

For extra load (the reporter needs a busy machine): `node -e "while(true){}"` x N.

## Result here

Linux x64, 2 cores, 4 GB, busy-loop load, fresh `.next` each boot:
- next 16.3.1: 14/14 boots healthy (all 200)
- next 16.4.0-canary.7 with FILLER=400 (412 pages): 10/10 boots healthy (all 200)

Not reproduced on Linux; the report is from Windows 11 / 14 cores.

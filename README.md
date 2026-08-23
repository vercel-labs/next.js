# Repro: Turbopack dev panic `the chunking context (unknown) does not support external modules (request: node:net)`

Issue: https://github.com/vercel/next.js/issues/97746 (Next.js 16.3.1)

## Run

```bash
npm install
npx next dev   # open http://localhost:3000/hiring -> HTTP 500 + /tmp/next-panic-*.log
```

Compare:

```bash
npx next build && npx next start   # /hiring returns 200
```

## Shape

`components/hiring-board.tsx` (`"use client"`) imports `lib/hiring-view.ts`, which is
also imported by the server chain and statically imports `lib/loopback-host.ts`
(`import { isIP } from "node:net"`). The client references graph therefore reaches
`node:net`.

* `next dev` (Turbopack): fatal panic while writing the app endpoint, repeated 500s.
* `next build` + `next start`: compiles and renders fine (200).

The panic names only `request: node:net`, never the client import chain
(`hiring-board.tsx -> lib/hiring-view.ts -> lib/loopback-host.ts`).

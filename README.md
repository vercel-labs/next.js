# Repro: next/script `beforeInteractive` never executes on notFound routes (#46825)

Mirror of https://stackblitz.com/edit/nextjs-nhdz2o updated to Next.js canary.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
```

Open `/` -> browser console logs `beforeInteractive script executed`.
Open `/article` (which calls `notFound()`) -> nothing is logged and `window.__beforeInteractiveRan` is undefined.

The HTML of `/article` contains no `(self.__next_s=self.__next_s||[]).push(...)` entry for the script;
the `<Script>` element only appears inside the RSC flight payload, so it is never executed.
Verified on next@16.3.1-canary.25 in dev (Turbopack) and with `next build && next start`.

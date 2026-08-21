# Repro: multiple lockfiles — Next.js picks the outer lockfile as workspace root (vercel/next.js#82689)

Layout mirrors the reporter's repro (szhsin/nextjs-lockfile-issue), pinned to `next@canary`.

- `/package-lock.json` (unrelated outer project, e.g. a deploy/releases parent dir)
- `/my-app/package-lock.json` (the actual Next.js app)

## Run

```
cd my-app
npm install
npm run build
```

## Observed (next@16.3.1-canary.26)

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of <repo>/package-lock.json as the root directory.
 Detected additional lockfiles:
   * <repo>/my-app/package-lock.json
```

The app's own directory (which has its own lockfile and package.json) is not chosen as the root.
Workaround: set `turbopack.root` / `outputFileTracingRoot` to the app dir.

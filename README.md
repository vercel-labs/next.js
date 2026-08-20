# Repro for vercel/next.js#66210 — StrictMode `useEffect` not double-invoked during hydration (App Router dev)

    npm install
    npm run dev            # terminal 1
    npm run check          # terminal 2 (headless Chromium, counts "effect" logs)

`npm run check` exits 0 when the mount effect runs twice (expected StrictMode
behaviour) and 1 when it runs once (the bug).

## Measured matrix (`next dev`, App Router, `reactStrictMode: true`, hydration of `/`)

| next | react / react-dom | bundler | "effect" logs |
| --- | --- | --- | --- |
| 14.3.0-canary.81 | 19.0.0-beta-04b058868c-20240508 | webpack | 1 (bug, as reported) |
| 15.5.0 | 19.1.0 | webpack | 1 (bug) |
| 15.5.0 | 19.2.8 | webpack | 1 (bug) |
| 15.5.0 | 19.2.8 | turbopack | 1 (bug) |
| 16.0.0 | 19.2.8 | turbopack | 1 (bug) |
| 16.3.1 | 19.2.8 | turbopack | 2 (fixed) |
| 16.3.1-canary.25 | 19.2.8 | turbopack & webpack | 2 (fixed) |

Notes:
- Only the initial hydration mount is affected; effects mounted during
  client-side navigation always double-invoke.
- Upgrading React alone on Next 15.5/16.0 does not fix it, so the change that
  fixed it landed on the Next.js side between 16.0.0 and 16.3.1.

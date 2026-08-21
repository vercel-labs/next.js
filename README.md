# Repro: aborted cold `/_next/image` transform permanently hangs that URL (next start)

Upstream issue: https://github.com/vercel/next.js/issues/96538
Repaired mirror of https://github.com/wine-hound/next-image-optimizer-abort-hang
(fix: `gen-image.js` needs `public/` to exist; `repro.sh` now creates it).

## Run

```bash
npm install
npm run build
./repro.sh
```

## Observed (next@16.3.0-canary.107, Node 24, Linux 2-core)

```
--- step 1: abort cold transform mid-flight: curl -m 0.02 .../_next/image?url=%2Fbig.jpg&w=640&q=75 ---
    curl exit: 28 (28 = client aborted, expected)
--- step 2: re-request the same URL with a 15 s timeout ---
    000 in 15.001675s
    curl exit: 28 (28 = HANG reproduced)
--- step 3: control, same image at w=828 ---
    200 in 0.275201s
--- server.log: no error, no warning ---
--- step 4: restart next start, probe the poisoned URL again ---
    after restart: 200 in 0.259532s
```

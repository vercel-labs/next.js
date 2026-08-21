# next#81881 — SWC plugin corrupts tagged template literals

Reproduction of https://github.com/vercel/next.js/issues/81881, repaired from the
reporter's repo (https://github.com/jantimon/reproduction-nextjs-swc-plugin-transform)
so it builds on Linux: `noop-swc/.cargo/config.toml` adds
`-C link-arg=--allow-undefined`, and `next` is pinned to `15.4.11`.

## Run

```bash
npm install
rustup target add wasm32-wasip1
npm run build:swc          # builds the no-op SWC wasm plugin
npm run verify             # boots next dev, fetches /, prints template args
```

`npm run verify` exits 1 when the bug is present.

## Observed (next 15.4.11 and 15.4.2-canary.10, webpack dev)

```
$[["\n  gap: ","\n  display: inline-flex;\n  width: 16px;\n  height: 16px;\n",";\n"],"8px","8px"]
$[["\n  display: inline-flex;\n  width: 16px;\n  height: 16px;\n"]]
```

`B`'s second quasi (`";\n  margin-bottom: "`) is replaced by `A`'s whole template body.

## Expected / seen once the SWC plugin is removed, or on 15.5.23 / 16.3.1-canary.26

```
$[["\n  gap: ",";\n  margin-bottom: ",";\n"],"8px","8px"]
$[["\n  display: inline-flex;\n  width: 16px;\n  height: 16px;\n"]]
```

Note: for other Next.js versions the plugin must be rebuilt against the matching
`swc_core` (15.4.x -> 30.1.1, 15.5.x -> 35.0.0, 16.3 canary -> 76.0.0).

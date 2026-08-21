# Reproduction for vercel/next.js#87630

`cacheComponents: true` + `bun --bun next dev` logs:

```
Next.js cannot guarantee that Cache Components will run as expected due to the current runtime's implementation of `setTimeout()`.
Please report a github issue here: https://github.com/vercel/next.js/issues/new/
```

The reporter's repro does **not** pin a Bun version, and the symptom is
Bun-version dependent, so this repro pins it explicitly.

## Run (reproduces the warning) — Bun 1.3.0

```bash
curl -fsSL https://bun.sh/install | BUN_INSTALL=/opt/bun130 bash -s "bun-v1.3.0"
/opt/bun130/bin/bun install
/opt/bun130/bin/bun --bun node_modules/next/dist/bin/next dev -p 3001
curl -s -o /dev/null http://localhost:3001/   # warning is printed on first render
```

## Control (no warning) — Bun 1.4.0

```bash
curl -fsSL https://bun.sh/install | bash          # 1.4.0
bun install
bun --bun node_modules/next/dist/bin/next dev -p 3000
curl -s -o /dev/null http://localhost:3000/       # no warning
```

## Why

`createAtomicTimerGroup()` warns when a `setTimeout()` handle has no numeric
`_idleStart`. Bun added that property in 1.4.0 (oven-sh/bun#26021), which
silences the warning.

```bash
node timers-probe.js              # _idleStart present & numeric: true -> 14
/opt/bun130/bin/bun timers-probe.js   # false -> undefined   (WARNING EXPECTED)
bun timers-probe.js               # true -> 145806
```

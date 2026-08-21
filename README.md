# Repro: Turbopack dev ignores NO_COLOR / non-TTY for Ecmascript issue code frames (vercel/next.js#77171)

## Run

```bash
npm install
NO_COLOR=1 FORCE_COLOR=0 TERM=dumb npx next dev --turbopack --port 3111 > dev.log 2>&1 &
sleep 20
curl -s -o /dev/null http://localhost:3111/api/edge
grep -c $'\x1b' dev.log   # > 0 => ANSI escapes emitted despite NO_COLOR + non-TTY
cat -v dev.log
```

## Observed (next@16.3.1-canary.26, Node 24)

Output is piped (non-TTY) and `NO_COLOR=1`, `TERM=dumb` are set. JS-side code frames are
plain, but the Turbopack-emitted warning still contains raw ANSI escapes:

```
⚠ ./app/api/edge/route.ts:4:22
Warning: A Node.js API is used (process.argv at line: 4) which is not supported in the Edge Runtime.
  ^[[90m2 |^[[0m
  ^[[90m3 |^[[0m ^[[36mexport^[[0m ^[[36mfunction^[[0m ^[[33mGET^[[0m() {
^[[33m^[[1m>^[[0m ^[[90m4 |^[[0m   ^[[36mconst^[[0m hasNoColor = process.argv.includes(^[[32m'--no-color'^[[0m)
```

## Expected

No ANSI escape sequences when `NO_COLOR` is set or stdout is not a TTY.

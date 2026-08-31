# Reproduction for vercel/next.js#98112

`next dev` throws `RangeError: Maximum call stack size exceeded` (in React's
`visitAsyncNode` async-debug tracing) and the RSC response never finishes
streaming when a Server Component awaits a long promise chain.

## Run

```bash
npm install
npx next dev
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" --max-time 35 "http://localhost:3000/?n=1000"   # 200, fast
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" --max-time 35 "http://localhost:3000/?n=5000"   # hangs until timeout (000)
```

## Observed

| version | `?n=1000` | `?n=5000` | server log |
| --- | --- | --- | --- |
| 15.5.18 dev (webpack) | 200 | hang, curl aborts at 35s | `RangeError: Maximum call stack size exceeded` + `unhandledRejection` |
| 15.5.24 dev (webpack) | 200 | hang | same |
| 15.5.18 `next build` + `next start` | 200 | 200 (~50ms) | clean |
| 16.3.3 / 16.4.0-canary.12 dev (turbopack and `--webpack`) | 200 | 200 | clean |

Workaround on the 15.x line: `node --stack-size=4000 node_modules/next/dist/bin/next dev`.

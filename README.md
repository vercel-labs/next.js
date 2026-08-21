# Repro: slow per-page first compilation with Turbopack dev (next 15.2.0+)

Ref: https://github.com/vercel/next.js/issues/80357

Minimal app-router app with 6 client pages (react-icons/date-fns/lodash/zod).
`run.sh <next-version> <port>` installs that version, starts `next dev --turbopack`
cold, then requests `/` and `/p0.../p5` sequentially and prints the "Compiled X in"
lines from the dev server log.

```
./run.sh 15.1.7 3017
./run.sh 15.2.0 3020
./run.sh 15.3.3 3033
```

Observed (2 vCPU Linux sandbox, cold `.next`, per-page "Compiled /pN in"):

| next | / | /p0 | /p1..p5 (avg) |
|---|---|---|---|
| 15.1.7 | 1992ms | 1400ms | ~179ms |
| 15.2.0 | 2.3s | 2.1s | ~1228ms |
| 15.3.3 | 2.3s | 2.3s | ~1251ms |
| 15.5.23 | 3.0s | 1429ms | ~294ms |
| 16.3.1-canary.25 | ~375ms (GET) | ~115ms | ~44ms |

=> ~6-7x regression per additional page in 15.2.0/15.3.3 vs 15.1.7; largely gone again
on 15.5.x / 16 canary.

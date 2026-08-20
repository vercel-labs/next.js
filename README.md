# outputFileTracing slows down `output: 'export'` builds (issue #66150)

Minimal check on Next.js 16.3.1 of https://github.com/vercel/next.js/issues/66150.
`output: 'export'` still runs output file tracing (webpack builds) and the
`outputFileTracing: false` escape hatch no longer exists.

```bash
npm install

# webpack: tracing runs, ~14s
rm -rf .next out && npx next build --webpack

# tracing duration (span `collect-build-traces`)
node -e "const l=require('fs').readFileSync('.next/trace','utf8').trim().split('\n');let o={};for(const x of l)for(const s of JSON.parse(x))if(/collect-build-traces|next-build$/.test(s.name))o[s.name]=(o[s.name]||0)+s.duration/1e6;console.log(o)"

# turbopack (default): tracing skipped entirely, ~7s
rm -rf .next out && npx next build
```

Measured in a Linux sandbox (Node 24):

| build | total | `collect-build-traces` |
| --- | --- | --- |
| `next build --webpack` | 13.9s | 7.73s |
| `next build --webpack` + `outputFileTracingExcludes: { '**/*': ['./**/*'] }` | 6.8s | 0.80s |
| `next build` (turbopack) | 7.0s | not run |

Original report (Next.js 14.2.3, reporter's repo): 7.5s with `outputFileTracing: false`
vs 12.0s with it enabled; `node-file-trace-build` span = 4.44s.

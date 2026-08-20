# Repro attempt for vercel/next.js#72144 — "Build failing to complete only in CI"

Minimal standalone version of the reporter's setup
(codecov/codecov-javascript-bundler-plugins `integration-tests/test-apps/nextjs`
at PR #185, Next 15.0.2 + `@codecov/nextjs-webpack-plugin`), plus the `bun test`
harness that actually reported the failure in their CI.

## Run

```bash
node mock-api.mjs &                     # stub codecov upload API on :9999
cd app-nextjs && npm install && cd ..

# 1) plain build (Next 15.0.2 + codecov webpack plugin, GitHub Actions env)
cd app-nextjs && CI=true GITHUB_ACTIONS=true \
  GITHUB_SHA=8e34196ab03754139953f22bff547edf44d7621a \
  GITHUB_REPOSITORY=acme/next-repro GITHUB_REF=refs/heads/main \
  API_URL=http://127.0.0.1:9999 npx next build; cd ..

# 2) same build wrapped in a bun test with a short timeout (as in their CI)
bun test build-timeout.test.ts
```

## Result

* (1) `next build` **succeeds** — no error, no empty `Error:` (matches the
  reporter's "we cannot reproduce locally").
* (2) The build gets as far as `Collecting build traces ...` and then the log
  ends with `error: Test "matches the snapshot" timed out after Nms` — the same
  output shape reported in the issue.

Timings on the same 2-vCPU Linux box, identical app/plugin/config:

| next | `next build` wall time |
| ---- | ---------------------- |
| 14.2.5 | ~13.7 s |
| 15.0.2 | ~17.6 s |

The reporter's passing Next 14 CI run took 22 997 ms against a 25 000 ms
`bun test` timeout, so the ~25-30% slower Next 15 build simply exceeds the test
timeout; the blank `Error:` with empty stack frames is bun tearing down the
killed `$` shell, not a `next build` failure.

# Reproduction for vercel/next.js#87881

`TurbopackInternalError: Invalid distDirRoot: ".next". distDirRoot should not navigate out of the projectPath.`
when `outputFileTracingRoot` is invalid (relative path, or a path inside the project).

The reporter's linked repo (Daves1245/nextjs-config-issue-example) ships a default
`next.config.ts` with no `outputFileTracingRoot`, so it builds successfully; this
repro adds the offending config.

## Run

```bash
npm i
npm run build
```

## Observed

- next 16.1.1 with `outputFileTracingRoot: "not-an-absolute-path"` or `"app"`:
  FATAL Turbopack panic + `TurbopackInternalError: Invalid distDirRoot: ".next"`.
- next 16.3.1-canary.26: relative non-existent path now fails with
  `failed to canonicalize path ...` (still not actionable), but a relative path that
  exists inside the project (`outputFileTracingRoot: "app"`) still panics with the
  same `Invalid distDirRoot` internal error.

## Expected

A clear, actionable config validation error naming `outputFileTracingRoot`.

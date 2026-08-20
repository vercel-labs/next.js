# Repro for vercel/next.js#40760 - EPERM: operation not permitted, scandir ... .next/standalone/.../node_modules/next

Windows-only. pnpm monorepo, `output: 'standalone'` + `outputFileTracingRoot`, app imports a workspace package.

```
pnpm install
pnpm --filter app build
```

Expected on Windows (without Developer Mode / elevated shell):
`[Error: EPERM: operation not permitted, scandir '...\.next\standalone\apps\app\node_modules\next']`

On Linux/macOS the build succeeds, which is why this needs a Windows host to observe.

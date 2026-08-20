# Reproduction for vercel/next.js#47979 — conditionally importing `next/navigation` vs `next/router`

Issue: https://github.com/vercel/next.js/issues/47979

The reporter (library author) needs to pick `next/navigation` or `next/router` at runtime and
reports that `import(variableModuleId)` produces
`Critical dependency: the request of a dependency is an expression` (webpack) and
`Cannot find module 'next/navigation'` at runtime.

## Run

```bash
npm install
npx next dev            # Turbopack: /expression fails to compile
npx next build --webpack && npx next start   # /expression -> "Cannot find module 'next/navigation'"
```

Routes:
- `/expression` — `lib/lib.js`: `const id = appDir ? 'next/navigation' : 'next/router'; await import(id)`
- `/literal` — `lib/lib2.js`: `appDir ? await import('next/navigation') : await import('next/router')`

## Observed (Next.js 16.3.1)

| variant | Turbopack (default) | webpack (`--webpack`) |
| --- | --- | --- |
| `/expression` | build/dev fails: `Module not found: Can't resolve <dynamic>` | builds with `Critical dependency: the request of a dependency is an expression`; browser shows `Cannot find module 'next/navigation'` |
| `/literal` | works, lazily loaded | works, lazily loaded |

Conditional dynamic imports with **literal** specifiers are the working pattern; the module is only
fetched when the branch executes, so `next/router` is never pulled into an app-router-only build.

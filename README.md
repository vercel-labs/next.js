# Repro: `use()` inside an async Server Component hangs (vercel/next.js#42469)

Minimal reproduction of https://github.com/vercel/next.js/issues/42469 on Next.js canary.

```bash
npm install
npm run dev   # then request http://localhost:3000/  -> never finishes
npm run build # -> fails: "Expected a suspended thenable. This is a bug in React."
```

- `/` renders an **async** Server Component (`app/todos.tsx`) that unwraps a promise
  prop with `use()` instead of `await`. The request streams the `<Suspense>` fallback
  (`Loading ...`) and never resolves; the dev server logs
  `Error: Expected a suspended thenable. This is a bug in React. Please file an issue.`
  as an uncaught exception.
- `/await-version` is the control: identical component using `await` renders instantly.
- `next build` fails prerendering `/` with the same React internal error.

There is still no lint rule / helpful error telling the user that `use()` cannot be
called in an async Server Component (the tracking ask in the issue).

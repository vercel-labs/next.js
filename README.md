# Repro: vercel/next.js#47131 — cannot test `async` server components with Jest + @testing-library/react

```bash
npm install
npm test
```

Versions observed: next 16.3.1-canary.25, react/react-dom 19.2.0, jest 29, @testing-library/react 16, jest-environment-jsdom.

Both tests fail:

1. `render(<Page />)` where `Page` is an async component -> React logs
   `<Page> is an async Client Component. Only Server Components can be async at the moment.`
   and renders nothing (`container.textContent === ""`).
2. The common workaround (`const resolved = await Page(); render(resolved)`) fails as soon as the
   tree contains a nested async component (`<Child />`): same error for `<Child>`, empty output.

With the reporter's original pinned versions (next 13.2.5-canary.3 / react 18.2.0) the same test
loops on `Error: Objects are not valid as a React child (found: [object Promise])` until the jest
worker aborts (exit code 134).

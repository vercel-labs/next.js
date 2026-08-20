# Repro: confusing `no-html-link-for-pages` "Pages directory cannot be found" warning (#51710)

Next.js / eslint-config-next 16.3.1, ESLint 9.

```bash
npm install
npm run lint          # app-router-less project: warning, no <a> anywhere
npm run lint:subdir   # pages dir exists in apps/web/src/pages: warning still printed
```

Both commands print, with zero lint errors and no `<a>` element in any file:

```
Pages directory cannot be found at <cwd>/pages or <cwd>/src/pages. If using a custom
path, please configure with the `no-html-link-for-pages` rule in your eslint config file.
```

Notes
- The warning is a bare `console.warn` from `no-html-link-for-pages` (packages/eslint-plugin-next/src/rules/no-html-link-for-pages.ts); the rule then returns `{}` and checks nothing.
- It is emitted whenever neither `pages`/`src/pages` nor `app`/`src/app` exists relative to ESLint's cwd (or `settings.next.rootDir`), so linting a component-only project or linting files that live in a sub-package from the repo root always warns.
- The linked doc page (https://nextjs.org/docs/messages/no-html-link-for-pages) documents an `<a>`-element error, which does not match what triggered the message.
- Creating `src/pages` only silences it when it is under ESLint's cwd — that is why the reporter's new `./src/pages` did not help (`npm run lint:subdir` shows the mismatch).

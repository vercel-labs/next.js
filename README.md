# Minimal repro: server class names are mangled in production builds (next.js#59594)

Libraries like typegoose / TypeORM / MikroORM derive collection or table names from
`SomeClass.name`. Next.js server minification mangles class names, so the name becomes
a single letter in production while it is correct in dev.

## Run

```bash
npm install
npm run dev      # server log prints: [repro] class name at runtime: BrokenModel
npm run build
npm start        # server log prints: [repro] class name at runtime: c   <-- bug
```

Also reproduces with the webpack bundler: `npx next build --webpack && npx next start`
(prints `e`).

Workaround (confirmed): `experimental.serverMinification: false`, wired to
`NO_SERVER_MINIFY=1` in `next.config.js`:

```bash
NO_SERVER_MINIFY=1 npm run build && NO_SERVER_MINIFY=1 npm start   # prints BrokenModel
```

Observed with Next.js 16.3.1-canary.25, Node 24.

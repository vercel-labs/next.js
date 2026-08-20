# Repro: fast-glob over app/**/*.mdx returns [] in Vercel production (issue #65388)

Minimal reproduction of https://github.com/vercel/next.js/issues/65388 (Next.js 14.2.3, App Router, @next/mdx).

`lib/mdx.js` collects case studies exactly like the reporter's `src/lib/mdx.ts`:
`glob('**/*.mdx', { cwd: 'app/work' })` + dynamic `import()` of each match.
The page is dynamically rendered (`export const dynamic = 'force-dynamic'`, matching the
dynamic rendering that `next-intl` forces in the reporter's app), so the glob runs
per-request inside the serverless function.

## Run

    npm install
    npm run build && npm run start   # http://localhost:3000 -> "matched mdx files: 2"

Deploy the same directory to Vercel and open `/`:

    matched mdx files: 0
    process.cwd(): /var/task
    readdir(cwd): [".next","___next_launcher.cjs","___vc","node_modules","package.json"]
    EMPTY: no case studies rendered

`/work/project-a` and `/work/project-b` (the MDX pages themselves) render fine, so only the
runtime filesystem lookup is broken.

## Root cause evidence

The `.mdx` source files are not part of the traced serverless function bundle: there is no
`app/` directory under `/var/task` at runtime, so the glob matches nothing (no error thrown).
Adding a statically analyzable read such as `fs.readdirSync(process.cwd() + '/app/work')`
makes the file tracer include `app/work/**` and the page then renders 2 entries in production
- i.e. the failure is missing file tracing for glob-based runtime reads, not MDX itself.

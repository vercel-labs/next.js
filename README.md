# Reproduction — vercel/next.js#96649

Agent skills assume `app/` at the repo root and dev server on port 3000.

Minimal Next.js 16.3.0 app that differs from the default only in the two ways the
issue names:

- App Router lives in `src/app` (not `app/`)
- `dev` script is `next dev --turbopack -p 3010` (not port 3000)

Both pages block prerendering (`cookies()` / `headers()` read at the top of the page),
so a Cache Components migration has real work to do.

## Run

```bash
npm install
./repro.sh
```

## Observed (Next.js 16.3.0, @next/codemod 16.3.0, skills at vercel/next.js@bc28b2d)

### 1. `next-cache-components-adoption` — silent false progress

The command written in
[`skills/next-cache-components-adoption/SKILL.md`](https://github.com/vercel/next.js/blob/canary/skills/next-cache-components-adoption/SKILL.md#L122)
is hardcoded to `./app`:

```
$ npx @next/codemod@latest cache-components-instant-false ./app --force
Skipping path ./app which does not exist.
No files selected, nothing to do.
All done.
Results:
0 errors
0 unmodified
0 skipped
0 ok
                                                    <- exit code 0
```

Pointing the same codemod at the real root works: `./src/app` -> `3 ok`.

The completion checks in the same document are also `app/`-rooted, and each produces
empty stdout on this project, i.e. they "pass":

```
$ grep -n "export const instant" app/layout.*        # SKILL.md L141
grep: app/layout.*: No such file or directory
$ grep -rln "TODO: Cache Components adoption" app    # SKILL.md L220
grep: app: No such file or directory
```

Yet nothing was migrated — `next build` still fails:

```
Error: Route "/": Next.js encountered uncached or runtime data during prerendering.
https://nextjs.org/docs/messages/blocking-prerender-dynamic
```

### 2. `next-dev-loop` — false refusal

`next dev` is up and healthy on 3010, but preflight step 2 of
[`skills/next-dev-loop/SKILL.md`](https://github.com/vercel/next.js/blob/canary/skills/next-dev-loop/SKILL.md)
probes `/_next/mcp` before the `NEXT_MCP_URL` note (which lives further down, under
`## gotchas`) has been read:

```
$ curl -X POST http://localhost:3000/_next/mcp -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
curl: (7) Failed to connect to localhost port 3000
   -> skill instruction: "Unreachable -> ... then refuse."

$ curl -X POST http://localhost:3010/_next/mcp -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
data: {"result":{"tools":[{"name":"get_project_metadata", ... "get_compilation_issues" ...]}}
```

The endpoint is live and lists `get_compilation_issues`; only the port in the
preflight order is wrong.

# Reproduction of vercel/next.js#96339

Mirror of https://github.com/hypernomad/next-use-cache-halted-prelude-repro (commit 43c312c)
with one fix so it works on Linux CI: `scripts/reproduce.mjs` now spawns `next start`
detached and kills the whole process group, otherwise only the `npx` wrapper was killed,
the previous round's server survived on port 4300, and later rounds silently reused a
warm (healthy) cache — reporting "not poisoned".

Run:

    npm ci
    npm run repro

Observed on next@16.3.0-canary.102 and next@16.3.0-canary.103 (Node 24.17, Linux):
control round healthy, poison rounds 5/5 POISONED, `Error: Connection closed.` in the
`next start` log for every subsequent read of the `late-data` "use cache" entry.

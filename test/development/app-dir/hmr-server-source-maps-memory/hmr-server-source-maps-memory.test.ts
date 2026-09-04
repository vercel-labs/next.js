import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

const EDITS = 6

// The dev server inlines a chunk's whole source map (including
// `sourcesContent`) into every owner-stack frame it hands to React, and the
// caches keyed by source position are never invalidated. Inserting a line at
// the top of a Server Component shifts every element below it, so every frame
// misses its cache and the server retains another copy of the source map.
//
// Measured on 16.4.0-canary.15 with this fixture: ~23 MB of retained heap per
// edit with Turbopack and ~20 MB with Webpack, versus ~1.7 MB per edit when
// the dev server runs with `--disable-source-maps`.
const MAX_RETAINED_MB_PER_EDIT = 8

// Webpack's dev server retains a comparable amount of memory per edit for
// reasons unrelated to source maps: a run with `--disable-source-maps` retains
// just as much (~17 MB per edit with this fixture), so only Turbopack can
// assert on the source map retention.
const itTurbopack = process.env.IS_TURBOPACK_TEST ? it : it.skip

describe('hmr-server-source-maps-memory', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    // `/memory` forces a GC so the measurement only sees retained memory.
    env: { NODE_OPTIONS: '--expose-gc' },
  })

  async function getRetainedHeap(): Promise<number> {
    const response = await next.fetch('/memory')
    expect(response.status).toBe(200)
    const { heapUsed, exposedGc } = await response.json()
    expect(exposedGc).toBe(true)
    return heapUsed
  }

  async function renderRevision(revision: number): Promise<void> {
    await retry(async () => {
      const response = await next.fetch('/')
      expect(response.status).toBe(200)
      expect(await response.text()).toContain(`rev ${revision}`)
    }, 30_000)
  }

  itTurbopack(
    'does not retain memory per edit of a Server Component',
    async () => {
      await renderRevision(0)

      const samples = [await getRetainedHeap()]

      for (let revision = 1; revision <= EDITS; revision++) {
        await next.patchFile('app/page.tsx', (content) =>
          content
            // Insert a line at the *top* of the file so the line and column of
            // every element below it changes.
            .replace('// MARKER', `// MARKER\n// edit ${revision}`)
            .replace(/rev \d+/, `rev ${revision}`)
        )
        await renderRevision(revision)
        samples.push(await getRetainedHeap())
      }

      const retainedMbPerEdit =
        (samples[samples.length - 1] - samples[0]) / EDITS / 1024 / 1024

      console.log(
        `retained ${retainedMbPerEdit.toFixed(1)} MB per edit, heapUsed samples: ${samples
          .map((bytes) => `${Math.round(bytes / 1024 / 1024)} MB`)
          .join(', ')}`
      )

      expect(retainedMbPerEdit).toBeLessThan(MAX_RETAINED_MB_PER_EDIT)
    }
  )
})

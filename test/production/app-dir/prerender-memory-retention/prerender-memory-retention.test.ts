import { nextTestSetup } from 'e2e-utils'

// The fixture logs the retained heap of the static generation worker after
// every n-th prerender. Before #97476, the worker retained roughly the size of
// each prerendered page (~0.4 MB per prerender in this fixture), so builds of
// sites with a few thousand pages ran out of heap. Afterwards the retained heap
// stays flat (~0.02 MB per prerender), which this threshold allows for.
const MAX_RETAINED_MB_PER_PRERENDER = 0.15

describe('prerender-memory-retention', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  it('does not retain memory per prerendered page', async () => {
    const { exitCode, cliOutput } = await next.build({
      // Lets the fixture collect garbage before sampling, so that the samples
      // only include retained memory.
      env: { NODE_OPTIONS: '--expose-gc' },
    })

    expect(exitCode).toBe(0)

    const samples = Array.from(
      cliOutput.matchAll(
        /\[heap\] prerenders=(\d+) heapUsedMB=(\d+) gc=(true|false)/g
      ),
      ([, prerenders, heapUsedMB, gc]) => ({
        prerenders: Number(prerenders),
        heapUsedMB: Number(heapUsedMB),
        gc: gc === 'true',
      })
    )

    // A few samples are needed to tell a trend from noise.
    expect(samples.length).toBeGreaterThan(4)

    // Without `--expose-gc` reaching the worker, the samples would include
    // uncollected garbage and the assertion below would be meaningless.
    expect(samples.map(({ gc }) => gc)).not.toContain(false)

    // The first sample is the baseline. It includes the memory that the worker
    // retains for the build itself (modules, manifests, caches), which does not
    // depend on the number of prerendered pages.
    const first = samples[0]
    const last = samples[samples.length - 1]
    const retainedMBPerPrerender =
      (last.heapUsedMB - first.heapUsedMB) /
      (last.prerenders - first.prerenders)

    console.log('heap samples', samples, { retainedMBPerPrerender })

    expect(retainedMBPerPrerender).toBeLessThan(MAX_RETAINED_MB_PER_PRERENDER)
  })
})

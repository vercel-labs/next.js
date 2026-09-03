import type webpack from 'webpack'
import { getOriginalStackFrames } from './middleware-webpack'

const MODULE_ID = '(app-pages-browser)/./app/page.js'

const SOURCE_MAP = {
  version: 3,
  file: 'page.js',
  sources: ['webpack://./app/page.tsx'],
  // No `sourcesContent`: rendering a code frame would require the SWC
  // bindings, which are irrelevant here.
  names: [],
  // Maps generated line 1, column 0 to source line 1, column 0.
  mappings: 'AAAA',
}

/**
 * Models the `Stats.compilation` object that the dev server keeps around and
 * that the overlay's `POST /__nextjs_original-stack-frames` handler reads from,
 * outside of the compile lifecycle.
 *
 * Under webpack that object is an inert JavaScript snapshot. Under
 * `next-rspack` it is a handle into the native compilation that
 * `Compiler::rebuild` replaces in place, so reading `compilation.modules` or
 * calling `chunkGraph.getModuleId()` while a rebuild is in flight dereferences
 * a stolen artifact and aborts the whole dev server with a Rust panic
 * (`attempted to read from stolen value: ...BuildModuleGraphArtifact`).
 * A JS-level assertion can only observe the access itself, so the test records
 * every read instead of trying to emulate the abort.
 */
function createCompilation({ rebuilding }: { rebuilding: boolean }) {
  const accesses: string[] = []
  const module = {} as webpack.Module

  const compilation = {
    compiler: { watching: { running: rebuilding } },
    get modules() {
      accesses.push('modules')
      return [module]
    },
    chunkGraph: {
      getModuleId() {
        accesses.push('getModuleId')
        return MODULE_ID
      },
    },
    codeGenerationResults: {
      get() {
        accesses.push('codeGenerationResults.get')
        return {
          sources: new Map([['javascript', { map: () => SOURCE_MAP }]]),
        }
      },
    },
  } as unknown as webpack.Compilation

  return { compilation, accesses }
}

function getStackFrames(compilation: webpack.Compilation) {
  return getOriginalStackFrames({
    isServer: false,
    isEdgeServer: false,
    isAppDirectory: true,
    frames: [
      {
        file: `webpack-internal:///${MODULE_ID}`,
        methodName: 'Page',
        line1: 1,
        column1: 1,
        arguments: [],
      },
    ],
    clientStats: () => ({ compilation }) as webpack.Stats,
    serverStats: () => null,
    edgeServerStats: () => null,
    rootDirectory: '/root',
  })
}

describe('getOriginalStackFrames', () => {
  it('maps a bundler frame through the compilation when it is idle', async () => {
    const { compilation, accesses } = createCompilation({ rebuilding: false })

    const [frame] = await getStackFrames(compilation)

    expect(accesses).toContain('getModuleId')
    expect(frame).toMatchObject({
      status: 'fulfilled',
      value: {
        originalStackFrame: {
          file: 'app/page.tsx',
          line1: 1,
          column1: 1,
        },
      },
    })
  })

  it('does not read from a compilation that is being rebuilt', async () => {
    const { compilation, accesses } = createCompilation({ rebuilding: true })

    const [frame] = await getStackFrames(compilation)

    // Reading the kept compilation here is what aborts `next dev` under
    // next-rspack, so nothing may be dereferenced during a rebuild.
    expect(accesses).toEqual([])
    // The frame comes back unmapped instead; it maps on the next request.
    expect(frame).toEqual({
      status: 'fulfilled',
      value: {
        originalStackFrame: {
          file: `webpack-internal:///${MODULE_ID}`,
          line1: 1,
          column1: 1,
          methodName: 'Page',
          ignored: false,
          arguments: [],
        },
        originalCodeFrame: null,
      },
    })
  })
})

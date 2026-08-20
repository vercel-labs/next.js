import { nextTestSetup } from 'e2e-utils'

// Turbopack emits and resolves WebAssembly chunks itself, so this only covers
// the webpack production server build.
;(process.env.IS_TURBOPACK_TEST ? describe.skip : describe)(
  'webpack wasm server output path',
  () => {
    const { next } = nextTestSetup({
      files: __dirname,
    })

    // With `asyncWebAssembly`, the webpack production server build emits the
    // wasm asset one directory too deep (`.next/server/chunks/static/wasm/`)
    // while the server bundle reads it from `.next/server/static/wasm/`, so the
    // route fails with ENOENT.
    // https://github.com/vercel/next.js/issues/29362
    it('serves a node route that imports a wasm module', async () => {
      const res = await next.fetch('/api/add')

      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ result: 2 })
    })
  }
)

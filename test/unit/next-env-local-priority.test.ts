import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

// Regression test for https://github.com/vercel/next.js/issues/17338
//
// `vercel dev` loads `.env` (and dashboard variables) into `process.env` before
// spawning `next dev`. `@next/env` skips every key that is already present in
// `process.env`, so the value that originally came from the lowest priority
// `.env` file ends up winning over `.env.local`, even though the docs promise
// that ".env.local always overrides the defaults set" and the dev server still
// reports `.env.local` as loaded.
describe('@next/env .env.local priority', () => {
  let dir: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'next-env-local-priority-'))
    fs.writeFileSync(path.join(dir, '.env'), 'TEST=from-dot-env\n')
    fs.writeFileSync(path.join(dir, '.env.local'), 'TEST=from-dot-env-local\n')
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  /**
   * Loads the env config from `dir` in a fresh module registry (`@next/env`
   * caches its result and the initial env snapshot) with `inherited` applied to
   * `process.env` first, and restores `process.env` afterwards.
   */
  function loadEnv(inherited: Record<string, string>) {
    const original = { ...process.env }

    try {
      // `.env.local` is intentionally ignored when NODE_ENV is `test`.
      process.env.NODE_ENV = 'development'
      delete process.env.__NEXT_PROCESSED_ENV
      delete process.env.TEST
      Object.assign(process.env, inherited)

      let result: {
        combinedEnv: { [key: string]: string | undefined }
        loadedEnvFiles: Array<{ path: string }>
      }
      jest.isolateModules(() => {
        const { loadEnvConfig } =
          require('../../packages/next-env') as typeof import('../../packages/next-env')
        const { combinedEnv, loadedEnvFiles } = loadEnvConfig(dir, true, {
          info: () => {},
          error: () => {},
        })
        // `combinedEnv` is `process.env` itself, so snapshot it before the
        // environment is restored below.
        result = { combinedEnv: { ...combinedEnv }, loadedEnvFiles }
      })
      return result!
    } finally {
      for (const key of Object.keys(process.env)) {
        if (!(key in original)) {
          delete process.env[key]
        }
      }
      Object.assign(process.env, original)
    }
  }

  it('prefers .env.local over .env', () => {
    const { combinedEnv, loadedEnvFiles } = loadEnv({})

    expect(loadedEnvFiles.map((file) => file.path)).toEqual([
      '.env.local',
      '.env',
    ])
    expect(combinedEnv.TEST).toBe('from-dot-env-local')
  })

  it('prefers .env.local over a value the parent process loaded from .env', () => {
    // What `vercel dev` does: it reads `.env` itself and passes the values down
    // to `next dev` through `process.env`.
    const { combinedEnv, loadedEnvFiles } = loadEnv({ TEST: 'from-dot-env' })

    expect(loadedEnvFiles.map((file) => file.path)).toEqual([
      '.env.local',
      '.env',
    ])
    expect(combinedEnv.TEST).toBe('from-dot-env-local')
  })

  it('still prefers a real environment variable over the env files', () => {
    const { combinedEnv } = loadEnv({ TEST: 'from-the-shell' })

    expect(combinedEnv.TEST).toBe('from-the-shell')
  })
})

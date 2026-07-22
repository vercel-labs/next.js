import type { ChildProcess } from 'node:child_process'
import { join } from 'node:path'
import { nextTestSetup } from 'e2e-utils'
import fs from 'fs-extra'
import { findPort, initNextServerScript, killApp, retry } from 'next-test-utils'

describe('compile mode public environment variables', () => {
  const publicEnvValue = 'compile-mode-value'
  const { next, isNextStart, skipped } = nextTestSetup({
    files: __dirname,
    env: {
      // The regression affects an unqualified `next build`, so exercise the
      // release's default bundler rather than the test runner's forced bundler.
      IS_TURBOPACK_TEST: '',
      IS_WEBPACK_TEST: '',
      NEXT_PUBLIC_COMPILE_MODE_VALUE: publicEnvValue,
    },
    skipDeployment: true,
    skipStart: true,
  })

  if (skipped) {
    return
  }

  if (!isNextStart) {
    it('is only applicable to production compile mode', () => {})
    return
  }

  let appPort: number
  let server: ChildProcess

  beforeAll(async () => {
    const { exitCode } = await next.build({
      args: ['--experimental-build-mode', 'compile'],
    })
    if (exitCode !== 0) {
      throw new Error(`Compile mode build exited with ${exitCode}`)
    }

    await fs.copy(
      join(next.testDir, '.next/static'),
      join(next.testDir, '.next/standalone/.next/static')
    )

    appPort = await findPort()
    server = await initNextServerScript(
      join(next.testDir, '.next/standalone/server.js'),
      /- Local:/,
      {
        ...process.env,
        ...next.env,
        HOSTNAME: '127.0.0.1',
        PORT: String(appPort),
      },
      undefined,
      { cwd: next.testDir }
    )
  })

  afterAll(async () => {
    if (server) {
      await killApp(server)
    }
  })

  it('inlines NEXT_PUBLIC values in client components', async () => {
    const browser = await next.browser('/', { baseUrl: appPort })

    expect(await browser.elementByCss('#server-value').text()).toBe(
      publicEnvValue
    )
    await retry(async () => {
      expect(await browser.elementByCss('#client-value').text()).toBe(
        publicEnvValue
      )
    })
  })
})

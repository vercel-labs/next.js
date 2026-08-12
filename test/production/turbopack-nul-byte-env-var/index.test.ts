import * as childProcess from 'child_process'
import path from 'path'
import stripAnsi from 'strip-ansi'
import { FileRef, nextTestSetup } from 'e2e-utils'

// Keep in sync with `app-fixture/run-build-with-nul-env.cjs`.
const NUL_ENV_VAR_NAME = 'NEXT_TEST_NUL_BYTE_ENV_VAR'

describe('turbopack build with a NUL byte in an environment variable', () => {
  const { next, isTurbopack, skipped } = nextTestSetup({
    files: new FileRef(path.join(__dirname, 'app-fixture')),
    skipStart: true,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  // The build is always started with `--turbopack`, but the failure only
  // concerns the Turbopack build path.
  ;(isTurbopack ? it : it.skip)(
    'names the offending environment variable instead of blaming a CSS module',
    async () => {
      const { status, stdout, stderr } = childProcess.spawnSync(
        'node',
        ['run-build-with-nul-env.cjs'],
        { cwd: next.testDir, encoding: 'utf8' }
      )

      const output = stripAnsi(`${stdout}${stderr}`)

      // The build cannot succeed with a malformed environment variable, but it
      // must fail with an actionable error that points at the variable.
      // eslint-disable-next-line jest/no-standalone-expect
      expect(status).not.toBe(0)
      // eslint-disable-next-line jest/no-standalone-expect
      expect(output).toContain(NUL_ENV_VAR_NAME)
      // eslint-disable-next-line jest/no-standalone-expect
      expect(output).not.toContain('TurbopackInternalError')
      // eslint-disable-next-line jest/no-standalone-expect
      expect(output).not.toContain('nul byte found in provided data')
      // eslint-disable-next-line jest/no-standalone-expect
      expect(output).not.toContain('globals.css')
    }
  )
})

import fs from 'fs-extra'
import execa from 'execa'
import { join } from 'path'
import { resolveNextTgzFilename, run, useTempDir } from './utils'

describe('create-next-app typecheck', () => {
  let nextTgzFilename: string

  beforeAll(() => {
    nextTgzFilename = resolveNextTgzFilename()
  })

  it('should typecheck a fresh TypeScript project without a prior build', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-ts-typecheck'
      const { exitCode } = await run(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--no-src-dir',
          '--no-tailwind',
          '--no-import-alias',
          '--no-react-compiler',
          '--no-agents-md',
          ...(process.env.NEXT_RSPACK ? ['--rspack'] : []),
        ],
        nextTgzFilename,
        { cwd }
      )
      expect(exitCode).toBe(0)

      const dir = join(cwd, projectName)

      // The generated `.gitignore` ignores `/.next/`, so a fresh clone (e.g.
      // CI) never has the generated route types that declare the global
      // `LayoutProps`/`PageProps` helpers used by the scaffolded
      // `app/layout.tsx`. Simulate that state before typechecking.
      await fs.remove(join(dir, '.next'))

      const tsc = await execa(
        'node',
        [join(dir, 'node_modules/typescript/bin/tsc'), '--noEmit'],
        { cwd: dir, reject: false }
      )

      // Typechecking a freshly generated project must not require running
      // `next build`/`next dev`/`next typegen` first.
      expect({ exitCode: tsc.exitCode, output: tsc.stdout.trim() }).toEqual({
        exitCode: 0,
        output: '',
      })
    })
  })
})

import execa from 'execa'
import { readFileSync, rmSync } from 'fs'
import { join } from 'path'
import {
  projectShouldHaveNoGitChanges,
  resolveNextTgzFilename,
  shouldBeTemplateProject,
  tryNextDev,
  run,
  useTempDir,
} from '../utils'

describe('create-next-app --app (App Router)', () => {
  let nextTgzFilename: string

  beforeAll(() => {
    nextTgzFilename = resolveNextTgzFilename()
  })

  it('should create JavaScript project with --js flag', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-js'
      const { exitCode } = await run(
        [
          projectName,
          '--js',
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
        {
          cwd,
        }
      )

      expect(exitCode).toBe(0)
      shouldBeTemplateProject({ cwd, projectName, template: 'app', mode: 'js' })
      await tryNextDev({
        cwd,
        projectName,
      })
    })
  })

  it('should create TypeScript project with --ts flag', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-ts'
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
        {
          cwd,
        }
      )

      expect(exitCode).toBe(0)
      shouldBeTemplateProject({ cwd, projectName, template: 'app', mode: 'ts' })
      await tryNextDev({ cwd, projectName })
      projectShouldHaveNoGitChanges({ cwd, projectName })
    })
  })

  it('should create project inside "src" directory with --src-dir flag', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-src-dir'
      const { exitCode } = await run(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--src-dir',
          '--no-tailwind',
          '--no-import-alias',
          '--no-react-compiler',
          '--no-agents-md',
          ...(process.env.NEXT_RSPACK ? ['--rspack'] : []),
        ],
        nextTgzFilename,
        {
          cwd,
          stdio: 'inherit',
        }
      )

      expect(exitCode).toBe(0)
      shouldBeTemplateProject({
        cwd,
        projectName,
        template: 'app',
        mode: 'ts',
        srcDir: true,
      })
      await tryNextDev({
        cwd,
        projectName,
      })
    })
  })

  it('should create TailwindCSS project with --tailwind flag', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-tw'
      const { exitCode } = await run(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--src-dir',
          '--tailwind',
          '--no-import-alias',
          '--no-react-compiler',
          '--no-agents-md',
          ...(process.env.NEXT_RSPACK ? ['--rspack'] : []),
        ],
        nextTgzFilename,
        {
          cwd,
        }
      )

      expect(exitCode).toBe(0)
      shouldBeTemplateProject({
        cwd,
        projectName,
        template: 'app-tw',
        mode: 'ts',
        srcDir: true,
      })
      await tryNextDev({
        cwd,
        projectName,
        tailwind: true,
      })
    })
  })

  it('should create an empty project with --empty flag', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-empty'
      const { exitCode } = await run(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--src-dir',
          '--empty',
          '--no-tailwind',
          '--no-import-alias',
          '--no-react-compiler',
          '--no-agents-md',
          ...(process.env.NEXT_RSPACK ? ['--rspack'] : []),
        ],
        nextTgzFilename,
        {
          cwd,
        }
      )

      const isEmpty = true
      expect(exitCode).toBe(0)
      shouldBeTemplateProject({
        cwd,
        projectName,
        template: 'app-empty',
        mode: 'ts',
        srcDir: true,
      })
      await tryNextDev({
        cwd,
        projectName,
        isEmpty,
      })
    })
  })

  it('should create an empty TailwindCSS project with --empty flag', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-tw-empty'
      const { exitCode } = await run(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--src-dir',
          '--tailwind',
          '--empty',
          '--no-import-alias',
          '--no-react-compiler',
          '--no-agents-md',
          ...(process.env.NEXT_RSPACK ? ['--rspack'] : []),
        ],
        nextTgzFilename,
        {
          cwd,
        }
      )

      const isEmpty = true
      expect(exitCode).toBe(0)
      shouldBeTemplateProject({
        cwd,
        projectName,
        template: 'app-tw-empty',
        mode: 'ts',
        srcDir: true,
      })
      await tryNextDev({
        cwd,
        projectName,
        isEmpty,
      })
    })
  })

  // Regression test for https://github.com/vercel/next.js/issues/97024:
  // the scaffolded `app/layout.tsx` uses the global `LayoutProps<'/'>` type,
  // which is only emitted into the (gitignored) generated types directory.
  // A fresh clone of a scaffolded project must still typecheck before any
  // Next.js command has been run.
  it('should typecheck on a fresh clone without running a Next.js command first', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'app-ts-fresh-clone-typecheck'
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
        {
          cwd,
        }
      )

      expect(exitCode).toBe(0)

      const dir = join(cwd, projectName)

      // A fresh clone only contains files that the generated `.gitignore`
      // does not ignore. Remove the ignored, generated type artifacts to
      // reproduce that state.
      const ignored = new Set(
        readFileSync(join(dir, '.gitignore'), 'utf8')
          .split('\n')
          .map((line) => line.trim())
      )
      if (ignored.has('/.next/')) {
        rmSync(join(dir, '.next'), { recursive: true, force: true })
      }
      if (ignored.has('next-env.d.ts')) {
        rmSync(join(dir, 'next-env.d.ts'), { force: true })
      }

      const {
        exitCode: tscExitCode,
        stdout,
        stderr,
      } = await execa(
        'node',
        [join(dir, 'node_modules/typescript/bin/tsc'), '--noEmit'],
        { cwd: dir, reject: false }
      )

      expect({ tscExitCode, output: `${stdout}${stderr}`.trim() }).toEqual({
        tscExitCode: 0,
        output: '',
      })
    })
  })
})

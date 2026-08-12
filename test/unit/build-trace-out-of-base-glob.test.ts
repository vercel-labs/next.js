/* eslint-env jest */

// Regression test for https://github.com/vercel/next.js/issues/96824
//
// When a traced dependency resolves a dynamic path that statically evaluates to
// a directory outside of the tracing base (e.g. `path.join(os.homedir(), name)`),
// build tracing emits a wildcard glob rooted at that directory. nft only guards
// against this with `relative(job.base, globBase).startsWith('..' + sep)`, which
// never fires on Windows when the project and the emitted base live on different
// drives (`D:\a\project` vs `C:\Users\runneradmin` on `windows-latest`) because
// `path.win32.relative()` returns an absolute path in that case. Tracing then
// walks the whole user profile, where junction cycles surface as fatal
// `EACCES: permission denied, scandir` webpack errors.
//
// `path` is forced to its win32 implementation so the drive layout that triggers
// the bug is exercised deterministically on every platform. The traced input is
// virtualized through nft's `readFile`/`stat`/`readlink` hooks, so the test never
// reads a real directory.
jest.mock('path', () => jest.requireActual('path').win32)
jest.mock('node:path', () => jest.requireActual('path').win32)

const win32 = jest.requireActual('path').win32

const BASE = 'D:\\a\\project'
const ENTRY = `${BASE}\\index.js`
// A drive that does not exist, so an unguarded glob can never walk a real
// directory when this test runs on Windows CI.
const OUT_OF_BASE_DIR = 'Z:\\Users\\runneradmin'

const files: Record<string, string> = {
  [ENTRY]:
    `const path = require('path')\n` +
    `module.exports = (name) => require(path.join(${JSON.stringify(
      OUT_OF_BASE_DIR
    )}, name))\n`,
  [`${BASE}\\package.json`]: JSON.stringify({ name: 'app' }),
}

const directories = new Set([
  'D:\\',
  'D:\\a',
  BASE,
  'Z:\\',
  'Z:\\Users',
  OUT_OF_BASE_DIR,
])

const dirStat = {
  isFile: () => false,
  isDirectory: () => true,
  isSymbolicLink: () => false,
}
const fileStat = {
  isFile: () => true,
  isDirectory: () => false,
  isSymbolicLink: () => false,
}

describe('build tracing out-of-base globs', () => {
  it('does not glob a directory outside of the tracing base', async () => {
    const { nodeFileTrace } = require('next/dist/compiled/@vercel/nft')

    const globbed: string[] = []
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation((message?: unknown) => {
        if (typeof message === 'string' && message.startsWith('Globbing ')) {
          globbed.push(message.slice('Globbing '.length))
        }
      })

    let fileList: Set<string>
    try {
      const result = await nodeFileTrace([ENTRY], {
        base: BASE,
        processCwd: BASE,
        log: true,
        mixedModules: true,
        readFile: async (file: string) => (file in files ? files[file] : null),
        stat: async (file: string) =>
          file in files ? fileStat : directories.has(file) ? dirStat : null,
        readlink: async () => null,
      })
      fileList = result.fileList
    } finally {
      logSpy.mockRestore()
    }

    // sanity check: the entry itself is still traced
    expect(Array.from(fileList)).toContain('index.js')

    const outOfBaseGlobs = globbed.filter((pattern) => {
      const relative = win32.relative(BASE, pattern)
      return win32.isAbsolute(relative) || relative.startsWith('..')
    })

    expect(outOfBaseGlobs).toEqual([])
  })
})

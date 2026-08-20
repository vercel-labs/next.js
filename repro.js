/**
 * Reproduction for https://github.com/vercel/next.js/issues/67541
 *
 * `copyTracedFiles()` (output: 'standalone') builds every destination path with
 *   path.join(outputPath, path.relative(tracingRoot, tracedFilePath))
 * On Windows a traced file that lives on another drive than the project
 * (e.g. the Yarn Berry global cache on C: while the project is on D:) makes
 * path.relative()/path.join() emit a mixed-drive path such as
 *   D:\Users\C:\Users\user\AppData\Local\Yarn\Berry\cache\...zip\node_modules\next\dist\pages
 * which Windows rejects with ENOENT (errno -4058) on mkdir.
 *
 * This harness runs the *real, unmodified* copyTracedFiles() from the installed
 * next package with win32 path semantics and an in-memory win32 filesystem, so
 * the defect is observable on any OS.
 */
const path = require('path')
const realFs = require('fs')
const win32 = path.win32

const DRIVE_PROJECT = 'D:\\Users\\user\\Documents\\gitRepositories\\myProj'
const YARN_CACHE =
  'C:\\Users\\user\\AppData\\Local\\Yarn\\Berry\\cache\\next-npm-14.2.4-37fb4e5b51-10c0.zip\\node_modules\\next'

const dir = DRIVE_PROJECT
const distDir = win32.join(dir, '.next')
const tracingRoot = dir
const tracedFileAbs = win32.join(YARN_CACHE, 'dist', 'pages', '_app.js')

// ---- tiny in-memory win32 filesystem -------------------------------------
const files = new Map()
const dirs = new Set(['D:\\', 'C:\\'])
const enoent = (syscall, p) => {
  const e = new Error(`ENOENT: no such file or directory, ${syscall} '${p}'`)
  e.errno = -4058
  e.code = 'ENOENT'
  e.syscall = syscall
  e.path = p
  return e
}
// Windows rejects any path segment containing ':' (only the drive prefix may).
const invalid = (p) =>
  p
    .split('\\')
    .slice(1)
    .some((seg) => seg.includes(':'))
const mkdirp = (p) => {
  if (invalid(p)) throw enoent('mkdir', p)
  const parts = p.split('\\')
  let cur = parts[0] + '\\'
  for (const seg of parts.slice(1).filter(Boolean)) {
    cur = win32.join(cur, seg)
    dirs.add(cur)
  }
}
const fakePromises = {
  async readFile(p) {
    if (!files.has(p)) throw enoent('open', p)
    return files.get(p)
  },
  async writeFile(p, data) {
    if (invalid(p)) throw enoent('open', p)
    files.set(p, String(data))
  },
  async mkdir(p) {
    mkdirp(p)
  },
  async rm() {},
  async readlink(p) {
    throw enoent('readlink', p)
  },
  async symlink() {},
  async copyFile(from, to) {
    if (!files.has(from)) throw enoent('copyfile', from)
    if (invalid(to)) throw enoent('copyfile', to)
    files.set(to, files.get(from))
  },
}

files.set(win32.join(dir, 'package.json'), JSON.stringify({ name: 'myProj' }))
files.set(tracedFileAbs, '// traced file from the Yarn Berry global cache on C:')

// node-file-trace records entries relative to the .nft.json file; across drives
// path.relative() cannot express that and leaks the absolute "C:\..." path.
const traceDir = win32.join(distDir, 'server', 'pages')
const entry = win32.relative(traceDir, tracedFileAbs)
console.log('nft.json entry recorded for the traced file:', entry, '\n')
for (const p of ['index.js', '_app.js', '_document.js', '_error.js']) {
  files.set(
    win32.join(traceDir, `${p}.nft.json`),
    JSON.stringify({ files: [entry] })
  )
}
files.set(win32.join(distDir, 'next-server.js.nft.json'), JSON.stringify({ files: [entry] }))

// ---- swap path + fs.promises for the duration of the call ----------------
const utils = require('next/dist/build/utils')
const patchedPath = ['join', 'relative', 'dirname', 'isAbsolute', 'sep']
const savedPath = {}
for (const k of patchedPath) {
  savedPath[k] = path[k]
  path[k] = win32[k]
}
const savedPromises = realFs.promises
Object.defineProperty(realFs, 'promises', { value: fakePromises, configurable: true })

const restore = () => {
  for (const k of patchedPath) path[k] = savedPath[k]
  Object.defineProperty(realFs, 'promises', { value: savedPromises, configurable: true })
}

;(async () => {
  try {
    const args = [
      dir,
      distDir,
      ['/'],
      undefined,
      tracingRoot,
      { output: 'standalone' },
      { middleware: {}, functions: {} },
      // `hasNodeMiddleware` only exists in newer versions of Next.js
      ...(utils.copyTracedFiles.length >= 10 ? [false] : []),
      false,
      new Set(),
    ]
    await utils.copyTracedFiles(...args)
    restore()
    console.log('\nno error: files written ->')
    for (const k of files.keys()) if (k.includes('standalone')) console.log('  ' + k)
  } catch (err) {
    restore()
    console.log('\nBuild error occurred (copyTracedFiles threw):')
    console.log(err)
    process.exitCode = 1
  }
})()

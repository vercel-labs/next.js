// Simulates Windows behaviour on a filesystem without symlink support
// (exFAT/FAT32 on D:, A:, etc.): readlink() on a regular file/dir fails with
// EISDIR instead of EINVAL/UNKNOWN.
const fs = require('fs')
const path = require('path')
const ROOT = process.cwd()

function eisdir(p) {
  const err = new Error(
    `EISDIR: illegal operation on a directory, readlink '${p}'`
  )
  err.code = 'EISDIR'
  err.errno = -4068
  err.syscall = 'readlink'
  err.path = p
  return err
}

const inProject = (p) =>
  typeof p === 'string' &&
  path.resolve(p).startsWith(ROOT) &&
  !path.resolve(p).includes('node_modules')

const origSync = fs.readlinkSync
fs.readlinkSync = function (p, ...rest) {
  if (inProject(p)) throw eisdir(p)
  return origSync.call(fs, p, ...rest)
}
const orig = fs.readlink
fs.readlink = function (p, ...rest) {
  const cb = rest[rest.length - 1]
  if (inProject(p) && typeof cb === 'function') {
    return process.nextTick(cb, eisdir(p))
  }
  return orig.call(fs, p, ...rest)
}
const origP = fs.promises.readlink
fs.promises.readlink = function (p, ...rest) {
  if (inProject(p)) return Promise.reject(eisdir(p))
  return origP.call(fs.promises, p, ...rest)
}

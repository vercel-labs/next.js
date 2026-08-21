/* Emulate the Windows MAX_PATH (260) limit of Git for Windows (core.longpaths=false)
 * on Linux: any attempt to create a file/dir whose fully-resolved path is longer
 * than MAXPATH_LIMIT characters fails with ENAMETOOLONG, which git reports as
 * "Filename too long". Repro for vercel/next.js#83429. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <errno.h>
#include <fcntl.h>
#include <limits.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

static int limit(void) {
  static int l = -1;
  if (l < 0) {
    const char *e = getenv("MAXPATH_LIMIT");
    l = e ? atoi(e) : 260;
  }
  return l;
}

/* full length of the path a syscall would resolve, or -1 if unknown */
static long full_len(int dirfd, const char *path) {
  if (!path) return -1;
  if (path[0] == '/') return (long)strlen(path);
  char base[PATH_MAX * 2];
  if (dirfd == AT_FDCWD) {
    if (!getcwd(base, sizeof base)) return -1;
  } else {
    char link[64];
    snprintf(link, sizeof link, "/proc/self/fd/%d", dirfd);
    ssize_t n = readlink(link, base, sizeof base - 1);
    if (n <= 0) return -1;
    base[n] = '\0';
  }
  return (long)strlen(base) + 1 + (long)strlen(path);
}

static int too_long(int dirfd, const char *path) {
  long n = full_len(dirfd, path);
  if (n > limit()) {
    if (getenv("MAXPATH_VERBOSE")) fprintf(stderr, "[maxpath] deny %ld: %s\n", n, path);
    return 1;
  }
  return 0;
}

#define REAL(name) static typeof(name) *r_##name; \
  if (!r_##name) r_##name = (typeof(name) *)dlsym(RTLD_NEXT, #name);

int open(const char *path, int flags, ...) {
  mode_t m = 0; va_list ap; va_start(ap, flags); m = va_arg(ap, mode_t); va_end(ap);
  REAL(open)
  if (too_long(AT_FDCWD, path)) { errno = ENAMETOOLONG; return -1; }
  return r_open(path, flags, m);
}
int open64(const char *path, int flags, ...) {
  mode_t m = 0; va_list ap; va_start(ap, flags); m = va_arg(ap, mode_t); va_end(ap);
  REAL(open64)
  if (too_long(AT_FDCWD, path)) { errno = ENAMETOOLONG; return -1; }
  return r_open64(path, flags, m);
}
int openat(int dirfd, const char *path, int flags, ...) {
  mode_t m = 0; va_list ap; va_start(ap, flags); m = va_arg(ap, mode_t); va_end(ap);
  REAL(openat)
  if (too_long(dirfd, path)) { errno = ENAMETOOLONG; return -1; }
  return r_openat(dirfd, path, flags, m);
}
int creat(const char *path, mode_t m) {
  REAL(creat)
  if (too_long(AT_FDCWD, path)) { errno = ENAMETOOLONG; return -1; }
  return r_creat(path, m);
}
int mkdir(const char *path, mode_t m) {
  REAL(mkdir)
  if (too_long(AT_FDCWD, path)) { errno = ENAMETOOLONG; return -1; }
  return r_mkdir(path, m);
}
int mkdirat(int dirfd, const char *path, mode_t m) {
  REAL(mkdirat)
  if (too_long(dirfd, path)) { errno = ENAMETOOLONG; return -1; }
  return r_mkdirat(dirfd, path, m);
}
int rename(const char *a, const char *b) {
  REAL(rename)
  if (too_long(AT_FDCWD, a) || too_long(AT_FDCWD, b)) { errno = ENAMETOOLONG; return -1; }
  return r_rename(a, b);
}

#define _GNU_SOURCE
#include <stdint.h>
#include <sys/stat.h>
/* Simulates a Docker Desktop bind mount (virtiofs / gRPC-FUSE) on plain Linux:
 * inotify watches are accepted for paths that exist, but no filesystem event is
 * ever delivered to the watcher. Everything else (reads, mtime, content) works. */
static int wd = 1;
int inotify_add_watch(int fd, const char *pathname, uint32_t mask) {
  (void)fd; (void)mask;
  struct stat st;
  if (stat(pathname, &st) != 0) return -1; /* keep real errno */
  return __sync_fetch_and_add(&wd, 1);
}
int inotify_rm_watch(int fd, int w) { (void)fd; (void)w; return 0; }

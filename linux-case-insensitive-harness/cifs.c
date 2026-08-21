#define FUSE_USE_VERSION 31
#define _GNU_SOURCE
#include <fuse.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include <dirent.h>
#include <sys/stat.h>
#include <sys/statvfs.h>
#include <sys/xattr.h>
#include <strings.h>

static char root_path[4096];

/* Resolve a fuse path (/a/b/c) into a real path under root, matching
   components case-insensitively when an exact match is missing. */
static void resolve(const char *path, char *out, size_t outsz) {
    snprintf(out, outsz, "%s", root_path);
    if (!path || !*path) return;
    const char *p = path;
    while (*p == '/') p++;
    char comp[512];
    while (*p) {
        const char *slash = strchr(p, '/');
        size_t len = slash ? (size_t)(slash - p) : strlen(p);
        if (len >= sizeof(comp)) len = sizeof(comp) - 1;
        memcpy(comp, p, len);
        comp[len] = 0;

        char cand[8192];
        snprintf(cand, sizeof(cand), "%s/%s", out, comp);
        struct stat st;
        if (lstat(cand, &st) != 0) {
            /* case-insensitive scan */
            DIR *d = opendir(out);
            if (d) {
                struct dirent *de;
                while ((de = readdir(d))) {
                    if (strcasecmp(de->d_name, comp) == 0) {
                        snprintf(comp, sizeof(comp), "%s", de->d_name);
                        break;
                    }
                }
                closedir(d);
            }
        }
        size_t cur = strlen(out);
        snprintf(out + cur, outsz - cur, "/%s", comp);
        if (!slash) break;
        p = slash + 1;
        while (*p == '/') p++;
    }
}

#define RP(path) char rp[8192]; resolve(path, rp, sizeof(rp))

static int x_getattr(const char *path, struct stat *st, struct fuse_file_info *fi) {
    (void)fi; RP(path);
    return lstat(rp, st) == 0 ? 0 : -errno;
}
static int x_access(const char *path, int mask) { RP(path); return access(rp, mask) == 0 ? 0 : -errno; }
static int x_readlink(const char *path, char *buf, size_t size) {
    RP(path); int r = readlink(rp, buf, size - 1); if (r < 0) return -errno; buf[r] = 0; return 0;
}
static int x_readdir(const char *path, void *buf, fuse_fill_dir_t filler, off_t off,
                     struct fuse_file_info *fi, enum fuse_readdir_flags flags) {
    (void)off; (void)fi; (void)flags; RP(path);
    DIR *d = opendir(rp); if (!d) return -errno;
    struct dirent *de;
    while ((de = readdir(d))) {
        struct stat st; memset(&st, 0, sizeof(st));
        st.st_ino = de->d_ino; st.st_mode = de->d_type << 12;
        if (filler(buf, de->d_name, &st, 0, 0)) break;
    }
    closedir(d); return 0;
}
static int x_mkdir(const char *path, mode_t m) { RP(path); return mkdir(rp, m) == 0 ? 0 : -errno; }
static int x_unlink(const char *path) { RP(path); return unlink(rp) == 0 ? 0 : -errno; }
static int x_rmdir(const char *path) { RP(path); return rmdir(rp) == 0 ? 0 : -errno; }
static int x_symlink(const char *from, const char *to) { RP(to); return symlink(from, rp) == 0 ? 0 : -errno; }
static int x_rename(const char *from, const char *to, unsigned int flags) {
    if (flags) return -EINVAL;
    char rf[8192]; resolve(from, rf, sizeof(rf));
    char rt[8192]; resolve(to, rt, sizeof(rt));
    return rename(rf, rt) == 0 ? 0 : -errno;
}
static int x_link(const char *from, const char *to) {
    char rf[8192]; resolve(from, rf, sizeof(rf));
    char rt[8192]; resolve(to, rt, sizeof(rt));
    return link(rf, rt) == 0 ? 0 : -errno;
}
static int x_chmod(const char *path, mode_t m, struct fuse_file_info *fi) { (void)fi; RP(path); return chmod(rp, m) == 0 ? 0 : -errno; }
static int x_chown(const char *path, uid_t u, gid_t g, struct fuse_file_info *fi) { (void)fi; RP(path); return lchown(rp, u, g) == 0 ? 0 : -errno; }
static int x_truncate(const char *path, off_t size, struct fuse_file_info *fi) {
    if (fi) return ftruncate(fi->fh, size) == 0 ? 0 : -errno;
    RP(path); return truncate(rp, size) == 0 ? 0 : -errno;
}
static int x_utimens(const char *path, const struct timespec ts[2], struct fuse_file_info *fi) {
    (void)fi; RP(path); return utimensat(AT_FDCWD, rp, ts, AT_SYMLINK_NOFOLLOW) == 0 ? 0 : -errno;
}
static int x_create(const char *path, mode_t m, struct fuse_file_info *fi) {
    RP(path); int fd = open(rp, fi->flags, m); if (fd < 0) return -errno; fi->fh = fd; return 0;
}
static int x_open(const char *path, struct fuse_file_info *fi) {
    RP(path); int fd = open(rp, fi->flags); if (fd < 0) return -errno; fi->fh = fd; return 0;
}
static int x_read(const char *path, char *buf, size_t size, off_t off, struct fuse_file_info *fi) {
    (void)path; int r = pread(fi->fh, buf, size, off); return r < 0 ? -errno : r;
}
static int x_write(const char *path, const char *buf, size_t size, off_t off, struct fuse_file_info *fi) {
    (void)path; int r = pwrite(fi->fh, buf, size, off); return r < 0 ? -errno : r;
}
static int x_statfs(const char *path, struct statvfs *st) { RP(path); return statvfs(rp, st) == 0 ? 0 : -errno; }
static int x_release(const char *path, struct fuse_file_info *fi) { (void)path; close(fi->fh); return 0; }
static int x_fsync(const char *path, int ds, struct fuse_file_info *fi) { (void)path; (void)ds; return fsync(fi->fh) == 0 ? 0 : -errno; }
static int x_fallocate(const char *path, int mode, off_t off, off_t len, struct fuse_file_info *fi) {
    (void)path; if (mode) return -EOPNOTSUPP; return posix_fallocate(fi->fh, off, len);
}

static const struct fuse_operations ops = {
    .getattr = x_getattr, .access = x_access, .readlink = x_readlink, .readdir = x_readdir,
    .mkdir = x_mkdir, .symlink = x_symlink, .unlink = x_unlink, .rmdir = x_rmdir,
    .rename = x_rename, .link = x_link, .chmod = x_chmod, .chown = x_chown,
    .truncate = x_truncate, .utimens = x_utimens, .create = x_create, .open = x_open,
    .read = x_read, .write = x_write, .statfs = x_statfs, .release = x_release,
    .fsync = x_fsync, .fallocate = x_fallocate,
};

int main(int argc, char *argv[]) {
    if (argc < 3) { fprintf(stderr, "usage: cifs <srcdir> <mountpoint> [fuse opts]\n"); return 1; }
    realpath(argv[1], root_path);
    argv[1] = argv[2];
    for (int i = 3; i < argc; i++) argv[i-1] = argv[i];
    argc--;
    return fuse_main(argc, argv, &ops, NULL);
}

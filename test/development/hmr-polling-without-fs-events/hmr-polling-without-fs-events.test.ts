import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import fs from 'fs'
import path from 'path'

// Regression test for https://github.com/vercel/next.js/issues/36774
//
// Docker Desktop bind mounts (gRPC-FUSE/virtiofs) accept inotify watches but
// never deliver events for host-side edits, so `next dev` never recompiles.
// `WATCHPACK_POLLING` is the workaround users rely on, and webpack honors it,
// but Turbopack ignores it, so `next dev --turbopack` has no way to recover
// from a filesystem that does not deliver events via an environment variable.
//
// The missing events are emulated without Docker: the page is edited through a
// hard link that lives outside the project directory. The write updates the
// very same inode (so the content behind `app/page.tsx` changes and its mtime
// moves), but the kernel reports the event against the link's directory, so no
// watcher inside the project directory is notified. Only polling can pick the
// change up.
describe('hmr-polling-without-fs-events', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    env: {
      WATCHPACK_POLLING: 'true',
    },
  })

  it('recompiles with WATCHPACK_POLLING when the filesystem delivers no events', async () => {
    expect(await next.render('/')).toContain('hmr-polling-v1')

    const pageFile = path.join(next.testDir, 'app/page.tsx')
    // A sibling of the (temporary) project directory, so it is on the same
    // filesystem, which hard links require, but outside of anything watched.
    const linkDir = fs.mkdtempSync(
      path.join(path.dirname(next.testDir), 'hmr-polling-link-')
    )
    const linkedPageFile = path.join(linkDir, 'page.tsx')
    fs.linkSync(pageFile, linkedPageFile)

    try {
      // In-place write through the hard link: same inode, no event for the
      // project directory.
      fs.writeFileSync(
        linkedPageFile,
        (await fs.promises.readFile(pageFile, 'utf8')).replace(
          'hmr-polling-v1',
          'hmr-polling-v2'
        )
      )
      expect(await fs.promises.readFile(pageFile, 'utf8')).toContain(
        'hmr-polling-v2'
      )

      await retry(
        async () => {
          expect(await next.render('/')).toContain('hmr-polling-v2')
        },
        20000,
        1000
      )
    } finally {
      fs.rmSync(linkDir, { recursive: true, force: true })
    }
  })
})

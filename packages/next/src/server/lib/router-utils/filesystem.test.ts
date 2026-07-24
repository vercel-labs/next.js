import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { defaultConfig } from '../../config-shared'
import { setupFsCheck } from './filesystem'

describe('filesystem cache', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'next-fs-check-'))
    const distDir = join(dir, '.next')
    const serverDir = join(distDir, 'server')
    await mkdir(serverDir, { recursive: true })

    await Promise.all([
      writeFile(join(distDir, 'BUILD_ID'), 'build-id'),
      writeFile(
        join(distDir, 'routes-manifest.json'),
        JSON.stringify({
          redirects: [],
          rewrites: { beforeFiles: [], afterFiles: [], fallback: [] },
          headers: [],
          onMatchHeaders: [],
          dynamicRoutes: [],
          dataRoutes: [],
        })
      ),
      writeFile(
        join(distDir, 'prerender-manifest.json'),
        JSON.stringify({
          preview: {
            previewModeId: 'id',
            previewModeSigningKey: 'signing-key',
            previewModeEncryptionKey: 'encryption-key',
          },
        })
      ),
      writeFile(join(serverDir, 'pages-manifest.json'), '{}'),
      writeFile(
        join(serverDir, 'functions-config-manifest.json'),
        JSON.stringify({ functions: {} })
      ),
    ])
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('includes URL keys when limiting the production filesystem cache', async () => {
    const fsChecker = await setupFsCheck({
      dir,
      dev: false,
      config: { ...defaultConfig, output: 'standalone' },
    })

    fsChecker.pageFiles.add('/first')
    expect(await fsChecker.getItem('/first')).toMatchObject({
      itemPath: '/first',
      type: 'pageFile',
    })
    fsChecker.pageFiles.delete('/first')

    // The retained URL keys together exceed the cache's 1 MiB size limit.
    const longSegment = 'x'.repeat(1024)
    for (let index = 0; index < 1100; index++) {
      await fsChecker.getItem(`/${longSegment}/${index}`)
    }

    expect(await fsChecker.getItem('/first')).toBeNull()
  })
})

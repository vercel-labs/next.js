import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'

import { MultiFileWriter } from './multi-file-writer'
import { nodeFs } from '../server/lib/node-fs-methods'

describe('MultiFileWriter', () => {
  let directory: string

  beforeEach(async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), 'multi-file-writer-'))
  })

  afterEach(async () => {
    await fs.rm(directory, { recursive: true, force: true })
  })

  it('writes the file after creating its directory', async () => {
    const filePath = path.join(directory, 'fetch-cache', 'entry.json')

    const writer = new MultiFileWriter(nodeFs)
    writer.append(filePath, 'hello')
    await writer.wait()

    expect(await fs.readFile(filePath, 'utf8')).toBe('hello')
  })

  // Regression test for https://github.com/vercel/next.js/issues/97271.
  //
  // During `next build`, several prerender workers own their own
  // `FileSystemCache`, and they can write the same `.next/cache/fetch-cache`
  // entry for the same fetch at the same time. Because the payloads differ in
  // length (`age`, `date` and tracing headers vary between responses), a
  // non-atomic write lets a reader observe one payload spliced into the other.
  // Such an entry can still parse as JSON while its base64 `body` is
  // misaligned, which surfaces as a `SyntaxError` thrown from user code.
  it('never exposes a partially written file when writers race on the same path', async () => {
    const filePath = path.join(directory, 'fetch-cache', 'entry.json')

    const long = JSON.stringify({
      kind: 'FETCH',
      data: { body: 'a'.repeat(2 * 1024 * 1024), status: 200 },
      revalidate: 60,
      tags: [],
    })
    const short = JSON.stringify({
      kind: 'FETCH',
      data: { body: 'b'.repeat(256 * 1024), status: 200 },
      revalidate: 60,
      tags: [],
    })

    let writing = true
    const torn: string[] = []

    // A concurrent reader, standing in for another worker reading the entry
    // back out of the cache.
    const reader = (async () => {
      while (writing) {
        let contents: string
        try {
          contents = await fs.readFile(filePath, 'utf8')
        } catch {
          continue
        }

        if (contents !== long && contents !== short && torn.length < 3) {
          torn.push(`observed ${contents.length} bytes on disk`)
        }
      }
    })()

    for (let i = 0; i < 25; i++) {
      // Two writers, standing in for two prerender workers persisting their
      // own response for the same fetch.
      const a = new MultiFileWriter(nodeFs)
      const b = new MultiFileWriter(nodeFs)

      a.append(filePath, long)
      b.append(filePath, short)

      await Promise.all([a.wait(), b.wait()])
    }

    writing = false
    await reader

    expect(torn).toEqual([])
    expect([long, short]).toContain(await fs.readFile(filePath, 'utf8'))
  }, 60_000)
})

import { execFileSync } from 'node:child_process'
import { nextTestSetup } from 'e2e-utils'

const nodeOptions = '--max-old-space-size=512'

function getHeapSizeLimit() {
  return Number(
    execFileSync(
      process.execPath,
      ['-p', "require('node:v8').getHeapStatistics().heap_size_limit"],
      {
        encoding: 'utf8',
        env: { ...process.env, NODE_OPTIONS: nodeOptions },
      }
    )
  )
}

describe('build worker NODE_OPTIONS', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
    skipStart: true,
  })

  it('should apply max-old-space-size to static build workers', async () => {
    const expectedHeapSizeLimit = getHeapSizeLimit()
    const { exitCode } = await next.build({
      env: { NODE_OPTIONS: nodeOptions },
    })

    expect(exitCode).toBe(0)

    const html = await next.readFile('.next/server/pages/index.html')
    const workerHeapSizeLimit = Number(
      html.match(/<p id="heap-size-limit">(\d+)<\/p>/)?.[1]
    )

    expect(workerHeapSizeLimit).toBe(expectedHeapSizeLimit)
  })
})

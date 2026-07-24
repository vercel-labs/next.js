import { nextTestSetup } from 'e2e-utils'

describe('pages directory initial scan', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    startCommand: 'node server.js',
    serverReadyPattern: /- Local:/,
    env: {
      NODE_OPTIONS: '--require ./delay-readdir.js',
    },
  })

  it('waits for the initial scan before becoming ready', async () => {
    const response = await next.fetch('/api/123')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ id: '123' })
  })
})

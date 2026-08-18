import http from 'http'
import { nextTestSetup } from 'e2e-utils'

// `node-fetch` (and `undici`) normalize the `Location` header for redirect
// responses, so the raw headers are read directly from the socket.
function getRawResponse(url: string): Promise<{
  statusCode: number
  rawHeaders: string[]
}> {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        res.resume()
        res.on('end', () =>
          resolve({ statusCode: res.statusCode, rawHeaders: res.rawHeaders })
        )
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

function getRawHeaderValues(rawHeaders: string[], name: string): string[] {
  const values: string[] = []
  for (let i = 0; i < rawHeaders.length; i += 2) {
    if (rawHeaders[i].toLowerCase() === name) {
      values.push(rawHeaders[i + 1])
    }
  }
  return values
}

describe('force-static-redirect-headers', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    // raw response headers can be folded by the proxy when deployed
    skipDeployment: true,
  })

  if (skipped) return

  it.each([
    { pathname: '/permanent/one', statusCode: 308 },
    { pathname: '/temporary/two', statusCode: 307 },
  ])(
    'should send a single location header for $pathname on the initial (uncached) response',
    async ({ pathname, statusCode }) => {
      const { statusCode: status, rawHeaders } = await getRawResponse(
        next.url + pathname
      )

      expect(status).toBe(statusCode)
      // when `location` is sent twice, proxies fold it into
      // `location: /target/x, /target/x` which breaks the redirect
      expect(getRawHeaderValues(rawHeaders, 'location')).toEqual([
        `/target/${pathname.split('/')[2]}`,
      ])
      expect(
        getRawHeaderValues(rawHeaders, 'x-nextjs-stale-time').length
      ).toBeLessThanOrEqual(1)
    }
  )
})

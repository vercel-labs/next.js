import http from 'node:http'
import { isNextStart, nextTestSetup } from 'e2e-utils'
;(isNextStart ? describe : describe.skip)(
  'App Router aborted response memory',
  () => {
    const { next } = nextTestSetup({
      files: {
        'app/layout.js': `
          export default function Layout({ children }) {
            return <html><body>{children}</body></html>
          }
        `,
        'app/abort/page.js': `
          import { Suspense } from 'react'

          export const dynamic = 'force-dynamic'

          async function Products() {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return (
              <ul>
                {Array.from({ length: 1000 }, (_, index) => (
                  <li key={index}>{'product description '.repeat(12)}{index}</li>
                ))}
              </ul>
            )
          }

          export default function Page() {
            return (
              <main>
                <Suspense fallback={<p>loading products</p>}>
                  <Products />
                </Suspense>
              </main>
            )
          }
        `,
        'server.js': `
          const express = require('express')
          const next = require('next')

          const port = Number(process.env.PORT)
          const app = next({ dev: false })

          app.prepare().then(() => {
            const server = express()
            const handler = app.getRequestHandler()

            server.get('/__memory', async (_req, res) => {
              for (let index = 0; index < 8; index++) {
                global.gc()
                await new Promise((resolve) => setTimeout(resolve, 10))
              }
              res.json(process.memoryUsage())
            })
            server.all('*', (req, res) => handler(req, res))
            const listener = server.listen(port, () => {
              const address = listener.address()
              console.log(
                '- Local: http://localhost:' + address.port +
                  '\\ncustom server ready'
              )
            })
          })
        `,
      },
      dependencies: { express: '4.21.2' },
      startCommand: 'node --expose-gc server.js',
      serverReadyPattern: /custom server ready/,
      skipDeployment: true,
    })

    async function abortResponse() {
      await new Promise<void>((resolve) => {
        const request = http.get(new URL('/abort', next.url), {
          headers: { 'accept-encoding': 'gzip' },
        })
        request.on('response', (response) => {
          response.on('error', () => {})
        })
        request.on('error', () => {})
        request.on('close', resolve)
        setTimeout(() => request.destroy(), 4)
      })
    }

    async function abortResponses(total: number) {
      for (let index = 0; index < total; index += 24) {
        await Promise.all(Array.from({ length: 24 }, abortResponse))
      }
    }

    async function externalMemory() {
      const response = await next.fetch('/__memory')
      const memory = await response.json()
      return memory.external as number
    }

    it('releases resources after clients disconnect from RSC responses', async () => {
      await abortResponses(120)
      await new Promise((resolve) => setTimeout(resolve, 200))
      const baseline = await externalMemory()

      await abortResponses(3000)
      await new Promise((resolve) => setTimeout(resolve, 200))
      const afterAborts = await externalMemory()

      expect(afterAborts - baseline).toBeLessThan(4 * 1024 * 1024)
    })
  }
)

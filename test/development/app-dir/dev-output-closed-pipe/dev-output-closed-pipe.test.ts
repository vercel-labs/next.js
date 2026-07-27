import type { ChildProcess } from 'child_process'
import { nextTestSetup } from 'e2e-utils'
import { findPort, killApp } from 'next-test-utils'

const COMMAND_TIMEOUT_MS = 60_000

;(process.env.IS_TURBOPACK_TEST ? describe : describe.skip)(
  'closed output pipe',
  () => {
    const { next } = nextTestSetup({
      files: {
        'app/layout.js': `export default function Layout({ children }) {
  return <html><body>{children}</body></html>
}`,
        'app/page.js': `export default function Page() {
  return <main>hello</main>
}`,
      },
      skipStart: true,
      skipDeployment: true,
    })

    it('finishes a build when the output pipe reader closes', async () => {
      let child: ChildProcess | undefined
      let output = ''
      let resolveStarted: () => void
      const started = new Promise<void>((resolve) => {
        resolveStarted = resolve
      })
      const abort = new AbortController()
      const build = next.runCommand(['build', '--turbopack'], {
        signal: abort.signal,
        onStdout(msg) {
          output += msg
          if (output.includes('Creating an optimized production build')) {
            resolveStarted()
          }
        },
        onStderr(msg) {
          output += msg
          if (output.includes('Creating an optimized production build')) {
            resolveStarted()
          }
        },
        instance(instance) {
          child = instance
        },
      })

      try {
        await Promise.race([
          started,
          build.then((result) => {
            throw new Error(
              `next build exited before starting with code ${result.exitCode}`
            )
          }),
        ])

        child!.stdout!.destroy()
        child!.stderr!.destroy()

        let timeout: NodeJS.Timeout
        const result = await Promise.race([
          build,
          new Promise<never>((_, reject) => {
            timeout = setTimeout(() => {
              abort.abort()
              reject(
                new Error(
                  `next build did not exit within ${COMMAND_TIMEOUT_MS}ms after its output pipes closed`
                )
              )
            }, COMMAND_TIMEOUT_MS)
          }),
        ]).finally(() => clearTimeout(timeout!))

        expect(result.code).toBe(0)
      } finally {
        if (child?.exitCode === null) abort.abort()
        await build.catch(() => {})
      }
    })

    it('does not hang in dev when the output pipe reader closes', async () => {
      const port = await findPort()
      let child: ChildProcess | undefined
      let resolveReady: () => void
      const ready = new Promise<void>((resolve) => {
        resolveReady = resolve
      })
      const exit = next.runCommand(['dev', '--turbopack', '-p', String(port)], {
        onStdout(msg) {
          if (msg.includes('Ready in')) resolveReady()
        },
        onStderr(msg) {
          if (msg.includes('Ready in')) resolveReady()
        },
        instance(instance) {
          child = instance
        },
      })

      const request = async (timeoutMs: number) => {
        const controller = new AbortController()
        let timeout: NodeJS.Timeout
        const outcome = await Promise.race([
          fetch(`http://localhost:${port}`, { signal: controller.signal }).then(
            (response) => ({ type: 'response' as const, response }),
            (error) => ({ type: 'request-error' as const, error })
          ),
          exit.then(() => ({ type: 'exit' as const })),
          new Promise<{ type: 'timeout' }>((resolve) => {
            timeout = setTimeout(() => {
              resolve({ type: 'timeout' })
              controller.abort()
            }, timeoutMs)
          }),
        ])
        clearTimeout(timeout!)
        return outcome
      }

      try {
        await Promise.race([
          ready,
          exit.then(() => {
            throw new Error('next dev exited before becoming ready')
          }),
        ])

        const warmup = await request(30_000)
        expect(warmup.type).toBe('response')
        if (warmup.type === 'response') {
          expect(warmup.response.status).toBe(200)
        }

        child!.stdout!.destroy()
        child!.stderr!.destroy()

        for (let i = 0; i < 20; i++) {
          const outcome = await request(5_000)
          expect(outcome.type).not.toBe('timeout')
          expect(outcome.type).not.toBe('request-error')
          if (outcome.type === 'response') {
            expect(outcome.response.status).toBe(200)
          } else {
            break
          }
        }
      } finally {
        if (child?.exitCode === null) {
          await killApp(child).catch(() => {})
        }
        await exit.catch(() => {})
      }
    })
  }
)

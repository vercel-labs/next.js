// Simulates a warm serverless container (e.g. Firebase Cloud Functions) where the
// Next.js router server is initialized more than once inside one Node process.
import path from 'node:path'
const { initialize } = await import('next/dist/server/lib/router-server.js')

const dir = path.resolve('.')
const count = Number(process.argv[2] || 5)

for (let i = 1; i <= count; i++) {
  const handler = await initialize({
    dir,
    port: 0,
    hostname: 'localhost',
    dev: false,
    minimalMode: false,
    isNodeDebugging: false,
    keepAliveTimeout: undefined,
    experimentalTestProxy: false,
    quiet: true,
  })
  void handler
  console.log(
    `init #${i}: uncaughtException=${process.listenerCount('uncaughtException')} ` +
      `unhandledRejection=${process.listenerCount('unhandledRejection')} ` +
      `names=[${process.listeners('uncaughtException').map((l) => l.name || 'anonymous').join(', ')}]`
  )
}
process.exit(0)

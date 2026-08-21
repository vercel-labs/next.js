import { continueFizzStream, streamToString, streamFromString } from 'next/dist/server/stream-utils/node-web-streams-helper.js'

function stream(chunks, delay) {
  const enc = new TextEncoder()
  return new ReadableStream({
    async start(c) {
      for (const ch of chunks) {
        if (delay) await new Promise((r) => setTimeout(r, 10))
        c.enqueue(enc.encode(ch))
      }
      c.close()
    },
  })
}

async function run(label, chunks, delay) {
  const rs = stream(chunks, delay)
  rs.allReady = Promise.resolve()
  const out = await continueFizzStream(rs, {
    inlinedDataStream: undefined,
    isStaticGeneration: false,
    isBuildTimePrerendering: false,
    buildId: 'x',
    getServerInsertedHTML: async () => '',
    getServerInsertedMetadata: async () => '',
  })
  console.log(label, JSON.stringify(await streamToString(out)))
}

await run('single chunk       ', ['<html><body>Hello</body></html>'], false)
await run('split same tick    ', ['<html><body>Hello</bo', 'dy></html>'], false)
await run('split across ticks ', ['<html><body>Hello</bo', 'dy></html>'], true)
await run('split at tag bound ', ['<html><body>Hello', '</body>', '</html>'], true)

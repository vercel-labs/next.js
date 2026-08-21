import Fastify from 'fastify'
import next from 'next'

const port = Number(process.env.PORT || 3000)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

await app.prepare()
const server = Fastify({ logger: false })

// AFTER: setHeader called after handle() -> reported as broken in Next 13/14+
server.all('/after/*', async (req, reply) => {
  await handle(req.raw, reply.raw)
  console.log('[after] setHeader own prop:', Object.prototype.hasOwnProperty.call(reply.raw,'setHeader'), String(reply.raw.setHeader).slice(0,120).replace(/\n/g,' '))
  console.log('[after] headersSent=', reply.raw.headersSent, 'writableEnded=', reply.raw.writableEnded)
  try {
    reply.raw.setHeader('Set-Cookie', 'sessionId=abc123; Max-Age=2592000')
  } catch (e) {
    console.log('[after] setHeader threw:', e.code, e.message)
  }
  reply.hijack()
})

// BEFORE: setHeader called before handle() -> works
server.all('/before/*', async (req, reply) => {
  reply.raw.setHeader('Set-Cookie', 'sessionId=abc123; Max-Age=2592000')
  await handle(req.raw, reply.raw)
  reply.hijack()
})

server.all('/*', async (req, reply) => {
  await handle(req.raw, reply.raw)
  reply.hijack()
})

await server.listen({ port, host: '0.0.0.0' })
console.log('ready on', port)

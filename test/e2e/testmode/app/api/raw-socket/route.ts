import { createConnection } from 'node:net'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const port = Number(new URL(request.url).searchParams.get('port'))
  try {
    const reply = await new Promise<string>((resolve, reject) => {
      const socket = createConnection({ host: '127.0.0.1', port }, () => {
        socket.write('ping')
      })
      socket.setTimeout(5000, () => {
        socket.destroy()
        reject(new Error('raw socket timed out'))
      })
      socket.on('data', (data) => {
        socket.end()
        resolve(data.toString())
      })
      socket.on('error', reject)
    })
    return Response.json({ reply })
  } catch (err) {
    return Response.json({ error: (err as Error).message })
  }
}

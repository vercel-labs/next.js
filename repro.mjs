// Sends a POST request with a full body then aborts the connection immediately.
import net from 'node:net'

const body = JSON.stringify({ hello: 'world'.repeat(100) })
const socket = net.connect(3000, '127.0.0.1', () => {
  socket.write(
    'POST /api/hello HTTP/1.1\r\n' +
      'Host: localhost:3000\r\n' +
      'Content-Type: application/json\r\n' +
      `Content-Length: ${Buffer.byteLength(body)}\r\n` +
      'Connection: close\r\n\r\n' +
      body
  )
  // abort right after the full body is written
  setTimeout(() => socket.destroy(), 30)
})
socket.on('error', () => {})
socket.on('close', () => {
  console.log('client socket destroyed (request aborted)')
  process.exit(0)
})

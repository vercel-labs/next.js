// Sends one POST request with a complete body, then aborts the socket before
// the response arrives. Point it at a route that has not been compiled yet.
const net = require('net')

const path = process.argv[2] || '/api/r1'
const delay = Number(process.argv[3] || 40)
const body = JSON.stringify({ hello: 'world' })

const socket = net.connect(3000, '127.0.0.1', () => {
  socket.write(
    `POST ${path} HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(
      body
    )}\r\n\r\n${body}`
  )
  setTimeout(() => {
    socket.destroy()
    console.log('aborted request to', path)
  }, delay)
})
socket.on('error', () => {})

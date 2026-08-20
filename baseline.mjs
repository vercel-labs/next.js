// Plain Node.js (no Next.js): both requests send Content-Length.
const body = JSON.stringify({ information: 'test123' })
const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body,
}
await fetch('http://127.0.0.1:4000/plain-node', options)
await fetch(new Request('http://127.0.0.1:4000/plain-node?req-object', options))

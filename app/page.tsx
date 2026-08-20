const url = 'http://127.0.0.1:4000/api'
const body = JSON.stringify({ information: 'test123' })
const options: RequestInit = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body,
}

export default function Home() {
  async function normalAction() {
    'use server'
    const res = await fetch(url, options)
    console.log('[normalAction] echo replied:', await res.text())
  }

  async function requestObjectAction() {
    'use server'
    const res = await fetch(new Request(url, options))
    console.log('[requestObjectAction] echo replied:', await res.text())
  }

  return (
    <div>
      <form action={normalAction}>
        <button id="normal" type="submit">Normal fetch</button>
      </form>
      <form action={requestObjectAction}>
        <button id="request-object" type="submit">Fetch with Request object</button>
      </form>
    </div>
  )
}

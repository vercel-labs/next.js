const url = 'http://127.0.0.1:4000/render'
const body = JSON.stringify({ information: 'test123' })
const options: RequestInit = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body,
}

export const dynamic = 'force-dynamic'

export default async function RenderPage() {
  await fetch(url, { ...options, cache: 'no-store' })
  await fetch(new Request(url + '?req-object', { ...options }), { cache: 'no-store' })
  return <div>render-time fetches done</div>
}

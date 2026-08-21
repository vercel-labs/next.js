export const dynamic = 'force-dynamic'

export default async function Page() {
  // outgoing request -> produces http.client.* metrics
  const res = await fetch('http://127.0.0.1:3000/api/outbound', { cache: 'no-store' })
  return <p>ok: {await res.text()}</p>
}

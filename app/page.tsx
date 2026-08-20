import Link from 'next/link'
async function gql(query: string) {
  const res = await fetch('http://127.0.0.1:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'token-abc' },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  })
  return res.json()
}

export default async function Page() {
  const a = await gql('{ topCommenters { following } }')
  return (
    <main>
      <p id="hits">{`upstream hits: ${a.data.hits}`}</p>
      <p id="now">{`upstream now: ${a.data.now}`}</p>
      <p id="rendered">{`rendered at: ${new Date().toISOString()}`}</p>
      <Link href="/other">go to /other</Link>
    </main>
  )
}

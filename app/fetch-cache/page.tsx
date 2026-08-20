async function getData() {
  const res = await fetch('http://localhost:3001/api/time', {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: 1 },
  })
  return res.json()
}

export default async function Page() {
  const a = await getData()
  const b = await getData()
  const c = await getData()
  const d = await getData()
  console.log('[page] rendered values:', JSON.stringify([a, b, c, d].map((x) => x.counter)))
  return (
    <pre id="values">{JSON.stringify({ renderedAt: new Date().toISOString(), values: [a, b, c, d] }, null, 2)}</pre>
  )
}

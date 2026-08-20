import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`http://127.0.0.1:9099/products/${id}`, {
    next: { revalidate: 5 },
  })
  if (res.status === 404) notFound()
  const product = await res.json()
  return <pre>{JSON.stringify({ upstreamStatus: res.status, product }, null, 2)}</pre>
}

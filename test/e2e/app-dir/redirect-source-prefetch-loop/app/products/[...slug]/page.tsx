import { connection } from 'next/server'
import { Suspense } from 'react'

async function Details({ params }: { params: Promise<{ slug: string[] }> }) {
  await connection()
  const { slug } = await params
  return <h1 id="product-heading">product: {slug.join('/')}</h1>
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  return (
    <Suspense fallback={null}>
      <Details params={params} />
    </Suspense>
  )
}

import { Suspense } from 'react'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return { title: `Category: ${slug}` }
}

async function Content({ params }) {
  const { slug } = await params
  return <h1 id="content">Category: {slug}</h1>
}

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<h1 id="content">Loading…</h1>}>
      <Content params={params} />
    </Suspense>
  )
}

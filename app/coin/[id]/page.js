import { Suspense } from 'react'

export async function generateMetadata({ params }) {
  const { id } = await params
  return { title: id.charAt(0).toUpperCase() + id.slice(1) }
}

async function Content({ params }) {
  const { id } = await params
  return <h1 id="h">coin: {id}</h1>
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<p id="h">loading…</p>}>
      <Content params={params} />
    </Suspense>
  )
}

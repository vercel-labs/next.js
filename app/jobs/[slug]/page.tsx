import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <Cached slug={slug} />
}

async function Cached({ slug }: { slug: string }) {
  'use cache'
  cacheLife('minutes')
  return <article>{slug}: {'y'.repeat(100000)}</article>
}

export default function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p>loading</p>}>
      <Detail params={params} />
    </Suspense>
  )
}

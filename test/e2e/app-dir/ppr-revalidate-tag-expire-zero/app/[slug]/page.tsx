import { Suspense } from 'react'
import { getProduct } from '../data'

export function generateStaticParams() {
  return [{ slug: 'a' }]
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: SearchParams
}) {
  // The root Suspense boundary is what allows non-enumerated slugs to be
  // rendered on demand. For the prerendered slug, its fallback must not end up
  // in the served static shell.
  return (
    <Suspense fallback={<p id="page-skeleton">page-skeleton</p>}>
      <View params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function View({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: SearchParams
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  return (
    <article>
      <h1 id="title">{product.title}</h1>
      <p id="fill">{product.fill}</p>
      <Suspense fallback={<p id="price-skeleton">price-skeleton</p>}>
        <Price searchParams={searchParams} />
      </Suspense>
    </article>
  )
}

async function Price({ searchParams }: { searchParams: SearchParams }) {
  const { v } = await searchParams

  return <p id="price">price for variant {String(v ?? 'default')}</p>
}

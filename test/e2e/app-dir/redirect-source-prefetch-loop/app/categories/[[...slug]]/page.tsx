import { connection } from 'next/server'
import { Suspense } from 'react'
import { LinkAccordion } from '../../../components/link-accordion'

// Dynamic (like the real listing page in the reproduction), rendered inside
// Suspense so the route still prerenders when Cache Components is enabled.
async function Listing({ params }: { params: Promise<{ slug?: string[] }> }) {
  await connection()
  const { slug } = await params
  const path = (slug ?? []).join('/')
  return (
    <>
      <h1 id="category-heading">category: {path || 'all'}</h1>
      <ul>
        {/* Live products. Prefetching these first is what teaches the client
            the /products/[...slug] route pattern. */}
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i}>
            <LinkAccordion href={`/products/live-${i + 1}`}>
              live product {i + 1}
            </LinkAccordion>
          </li>
        ))}
        {/* Retired products. Their hrefs are `redirects()` sources. */}
        {Array.from({ length: 2 }, (_, i) => (
          <li key={i}>
            <LinkAccordion href={`/products/retired-${i + 1}`}>
              retired product {i + 1}
            </LinkAccordion>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return (
    <Suspense fallback={null}>
      <Listing params={params} />
    </Suspense>
  )
}

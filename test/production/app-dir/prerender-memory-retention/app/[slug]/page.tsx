import { Suspense } from 'react'
import { connection } from 'next/server'
import { PAGE_COUNT } from '../../lib/config'
import { getContent } from '../../lib/content'
import { recordHeapSample } from '../../lib/heap-probe'

export function generateStaticParams() {
  return Array.from({ length: PAGE_COUNT }, (_, index) => ({
    slug: `page-${index}`,
  }))
}

/** Dynamic hole, so that every page is a partial prerender. */
async function Dynamic() {
  await connection()

  return <footer>rendered at request time</footer>
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const paragraphs = await getContent(slug)

  recordHeapSample()

  return (
    <main>
      <article>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
      <Suspense fallback={<footer>…</footer>}>
        <Dynamic />
      </Suspense>
    </main>
  )
}

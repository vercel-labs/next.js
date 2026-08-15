import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

type Props = { params: Promise<{ id: string }> }

// Only `seeded` is resolved at build time. Any other id renders on demand
// through the PPR resume path, which is where the duplicate ids appear.
export function generateStaticParams() {
  return [{ id: 'seeded' }]
}

async function getWidgetData(index: number) {
  'use cache'
  // Resolves during the build prerender and is outlined into a hidden
  // segment baked into the stored shell, but goes stale quickly so runtime
  // requests re-render these boundaries in a fresh continuation.
  cacheLife({ stale: 5, revalidate: 10, expire: 300 })
  return `widget-${index}`
}

// Large enough (> progressiveChunkSize) that React outlines the boundary
// into a hidden segment instead of inlining it.
async function Widget({ index }: { index: number }) {
  const data = await getWidgetData(index)
  const rows = Array.from({ length: 600 }, (_, i) => `${data}-row-${i}`)
  return (
    <ul>
      {rows.map((row) => (
        <li key={row}>{row}</li>
      ))}
    </ul>
  )
}

async function getRelated(kind: string, id: string) {
  'use cache'
  cacheLife({ stale: 5, revalidate: 10, expire: 300 })
  return Array.from({ length: 200 }, (_, i) => `${kind}-${id}-row-${i}`)
}

// Dynamic (awaits `params`) and fans out into several nested `'use cache'`
// calls, so the request-time resume allocates new segment ids.
async function Content({ params }: Props) {
  const { id } = await params
  const groups = await Promise.all([
    getRelated('a', id),
    getRelated('b', id),
    getRelated('c', id),
    getRelated('d', id),
  ])
  return (
    <div>
      {groups.map((rows, i) => (
        <ul key={i}>
          {rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default async function Page({ params }: Props) {
  return (
    <main>
      {[0, 1, 2].map((index) => (
        <Suspense fallback={<p>widget fallback</p>} key={index}>
          <Widget index={index} />
        </Suspense>
      ))}
      <Suspense fallback={<p>content fallback</p>}>
        <Content params={params} />
      </Suspense>
    </main>
  )
}
